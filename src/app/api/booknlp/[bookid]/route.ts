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

    // Require 'text' in request body
    const body = await req.json();
    const { text } = body || {};
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid text in request body' }, { status: 400 });
    }

    // Call the BOOKNLP_URL with text
    const response = await fetch(BOOKNLP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch BookNLP data' }, { status: 500 });
    }
    const data = await response.json();
    const { characters, chapters } = data;

    if (!characters || !chapters) {
      return NextResponse.json({ error: 'Invalid BookNLP data format' }, { status: 400 });
    }


    // Store in MongoDB
    const client = await clientPromise;
    const db = client.db();

    // 1. Store characters as a single document in 'characters' collection
    const charactersCollection = db.collection('characters');
    await charactersCollection.updateOne(
      { bookid },
      { $set: { bookid, characters } },
      { upsert: true }
    );

    // 2. Store each chapter as a separate document in 'chapter' collection
    const chapterCollection = db.collection('chapter');
    // Remove existing chapters for this bookid first (to avoid duplicates)
    await chapterCollection.deleteMany({ bookid });
    if (Array.isArray(chapters)) {
      const chaptersToInsert = chapters.map((chapter) => ({ ...chapter, bookid }));
      if (chaptersToInsert.length > 0) {
        await chapterCollection.insertMany(chaptersToInsert);
      }
    }

    // 3. Store summary in 'books' collection
    const booksCollection = db.collection('books');

    // Get the _id of the characters document for this bookid
    const characterDoc = await charactersCollection.findOne({ bookid });
    const characterId = characterDoc ? characterDoc._id : null;

    // Get the _ids of all chapter documents for this bookid
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
