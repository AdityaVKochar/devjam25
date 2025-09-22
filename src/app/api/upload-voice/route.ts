import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, data } = body || {};
    if (!filename || !data || typeof data !== 'string') {
      return NextResponse.json({ error: 'Missing filename or data' }, { status: 400 });
    }

    const match = data.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    const mimeType = match[1];
    const b64 = match[2];

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('voicefiles');
    const doc = {
      filename,
      mimeType,
      data: b64,
      createdAt: new Date(),
    };
    const res = await collection.insertOne(doc);
    return NextResponse.json({ success: true, id: res.insertedId });
  } catch (err) {
    console.error('upload-voice error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
