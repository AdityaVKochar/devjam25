import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET /api/booklines?bookid=BOOKID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const bookid = searchParams.get('bookid');
    if (!bookid) {
      return NextResponse.json({ error: 'Missing bookid' }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db();
    // Get book document
    const book = await db.collection('books').findOne({ bookid });
    if (!book || !Array.isArray(book.chapterIds)) {
      return NextResponse.json({ error: 'Book not found or missing chapters' }, { status: 404 });
    }
    // Get all chapters by _id
    const chapters = await db.collection('chapter')
      .find({ _id: { $in: book.chapterIds } })
      .toArray();
    // Collect all lines' text
    const lines = chapters.flatMap(chap => Array.isArray(chap.lines) ? chap.lines.map(line => line.text) : []);
    return NextResponse.json({ lines });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
