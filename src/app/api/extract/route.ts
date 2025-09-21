import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { link } = await req.json();
    if (!link) {
      return NextResponse.json({ error: 'Missing link parameter' }, { status: 400 });
    }

    // Call localhost:5000/extract with the link parameter
    await fetch('http://localhost:5000/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link }),
    });

    // Do nothing with the response data for now
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
