import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const BOOKNLP_URL = process.env.BOOKNLP_URL;

export async function POST(req: NextRequest, { params }: { params: { bookid: string } }) {
  try {
    const { bookid } = await params;
    if (!bookid) {
      return NextResponse.json({ error: 'Missing bookid in URL' }, { status: 400 });
    }
    if (!BOOKNLP_URL) {
      return NextResponse.json({ error: 'BOOKNLP_URL not set in environment' }, { status: 500 });
    }

    console.log("1111")

    // Require 'text' in request body
    const body = await req.json();
    const { text } = body || {};
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text in request body' }, { status: 400 });
    }

    console.log("2222")

    // Call the BOOKNLP_URL with text
    const response = await fetch(BOOKNLP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, bookid })
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch BookNLP data' }, { status: 500 });
    }

    console.log("3333")

    const data = await response.json();
    console.log(data);
    const {parent_json} = data ;
    console.log(parent_json);
    const { characters, chapters } = parent_json;
    //console.log(character)

    console.log("4444")

    if (!characters || !chapters) {
      return NextResponse.json({ error: 'Invalid BookNLP data format' }, { status: 400 });
    }

    console.log("555")
    // Store in MongoDB
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
