import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Assuming files are stored in a 'books' collection, adjust as needed
    const books = await db.collection('books').find({}, { projection: { bookid: 1, _id: 0 } }).toArray();
    // You can expand the projection to include more fields if needed
    return NextResponse.json({ files: books });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}
