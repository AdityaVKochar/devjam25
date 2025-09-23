import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const VOICE_URL = process.env.VOICE_URL;

export async function POST(req: NextRequest, { params }: { params: { bookid: string } }) {
  try {
    const { bookid } = params;
    if (!bookid) {
      return NextResponse.json({ error: 'Missing bookid in URL' }, { status: 400 });
    }

    if (!VOICE_URL) {
      return NextResponse.json({ error: 'VOICE_URL not set in environment' }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db();

    const charactersCollection = db.collection('characters');
    const chapterCollection = db.collection('chapter');

    const characterDoc = await charactersCollection.findOne({ bookid });
    const characters = characterDoc?.characters ?? [];

    const chapterDocs = await chapterCollection.find({ bookid }).toArray();
    // Ensure chapters is an array and strip MongoDB _id before sending
    const chapters = Array.isArray(chapterDocs)
      ? chapterDocs.map((c) => {
          const { _id, ...rest } = c as any;
          return rest;
        })
      : [];

  const payload = { characters, chapters };

    const url = `${VOICE_URL}?bookid=${encodeURIComponent(bookid)}`;
    const voiceResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!voiceResponse.ok) {
      const text = await voiceResponse.text().catch(() => '');
      return NextResponse.json({ error: 'VOICE service error', details: text }, { status: 502 });
    }

    const arrayBuffer = await voiceResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': voiceResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': String(arrayBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error('listen route error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { bookid: string } }) {
  // Allow GET to call the same logic by proxying to POST handler
  try {
    // Build a fake NextRequest by calling POST internals — easiest is to call the POST handler
    // but since we can't easily construct NextRequest here, call the logic directly instead.
    const bookid = await params.bookid;
    if (!bookid) {
      return NextResponse.json({ error: 'Missing bookid in URL' }, { status: 400 });
    }

    if (!VOICE_URL) {
      return NextResponse.json({ error: 'VOICE_URL not set in environment' }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db();

    const charactersCollection = db.collection('characters');
    const chapterCollection = db.collection('chapter');

    const characterDoc = await charactersCollection.findOne({ bookid });
    const characters = characterDoc?.characters ?? [];

    const chapterDocs = await chapterCollection.find({ bookid }).toArray();
    const chapters = Array.isArray(chapterDocs)
      ? chapterDocs.map((c) => {
          const { _id, ...rest } = c as any;
          return rest;
        })
      : [];

  const payload = { characters, chapters };

    const url = `${VOICE_URL}?bookid=${encodeURIComponent(bookid)}`;
    const voiceResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!voiceResponse.ok) {
      const text = await voiceResponse.text().catch(() => '');
      return NextResponse.json({ error: 'VOICE service error', details: text }, { status: 502 });
    }

    const arrayBuffer = await voiceResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': voiceResponse.headers.get('content-type') || 'audio/mpeg',
        'Content-Length': String(arrayBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error('listen GET error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
