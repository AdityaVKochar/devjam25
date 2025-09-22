import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const BOOKNLP_URL = process.env.BOOKNLP_URL;

export async function POST(req: NextRequest, { params }: { params: { bookid: string } }) {
  try {
    const { bookid } = params;
    if (!bookid) {
      return NextResponse.json({ error: 'Missing bookid in URL' }, { status: 400 });
    }
    if (!BOOKNLP_URL) {
      return NextResponse.json({ error: 'BOOKNLP_URL not set in environment' }, { status: 500 });
    }

    const body = await req.json();
    const { text } = body || {};
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text in request body' }, { status: 400 });
    }

    let characters: any = [];
    let chapters: any = [];

    if (BOOKNLP_URL) {
      const response = await fetch(BOOKNLP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch BookNLP data' }, { status: 500 });
      }
      const data = await response.json();
      characters = data.characters;
      chapters = data.chapters;

      if (!characters || !chapters) {
        return NextResponse.json({ error: 'Invalid BookNLP data format' }, { status: 400 });
      }
    } else {
      characters = [];
      const rawLines = (text || "").split(/\r?\n/);
      const lines = rawLines.map((l) => ({ text: (l || "").trim() })).filter((l) => l.text);
      chapters = [
        {
          title: 'Chapter 1',
          lines,
          bookid,
        },
      ];
    }

    const client = await clientPromise;
    const db = client.db();

    const charactersCollection = db.collection('characters');
    await charactersCollection.updateOne(
      { bookid },
      { $set: { bookid, characters } },
      { upsert: true }
    );

    const chapterCollection = db.collection('chapter');
    await chapterCollection.deleteMany({ bookid });
    if (Array.isArray(chapters)) {
      const chaptersToInsert = chapters.map((chapter) => ({ ...chapter, bookid }));
      if (chaptersToInsert.length > 0) {
        await chapterCollection.insertMany(chaptersToInsert);
      }
    }

    const booksCollection = db.collection('books');

    const characterDoc = await charactersCollection.findOne({ bookid });
    const characterId = characterDoc ? characterDoc._id : null;

    const chapterDocs = await chapterCollection.find({ bookid }).project({ _id: 1 }).toArray();
    const chapterIds = chapterDocs.map((doc) => doc._id);

    await booksCollection.updateOne(
      { bookid },
      { $set: { bookid, characterId, chapterIds } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
