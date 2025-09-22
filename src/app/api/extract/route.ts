    import { NextRequest, NextResponse } from 'next/server';

    export async function POST(req: NextRequest) {
    try {
        const { link } = await req.json();
        if (!link) {
        console.error('Missing link parameter');
        return NextResponse.json({ error: 'Missing link parameter' }, { status: 400 });
        }

        // Extract book_id from the link (e.g., https:/novelbin.com/b/{book_id})
        const match = link.match(/novelbin\.com\/b\/([^/?#]+)/);
        const book_id = match ? match[1] : null;
        if (!book_id) {
        console.error('Invalid link format, book_id not found:', link);
        return NextResponse.json({ error: 'Invalid link format, book_id not found' }, { status: 400 });
        }

        // Call EXTRACTION_URL from environment with the link parameter
        const EXTRACTION_URL = process.env.EXTRACTION_URL;
        if (!EXTRACTION_URL) {
        console.error('EXTRACTION_URL not set in environment');
        return NextResponse.json({ error: 'EXTRACTION_URL not set in environment' }, { status: 500 });
        }
        const extractionRes = await fetch(EXTRACTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
        });

        if (!extractionRes.ok) {
        console.error('Extraction failed:', await extractionRes.text());
        return NextResponse.json({ error: 'Extraction failed' }, { status: 500 });
        }

        // extractionData is plain text, not JSON
        const text = await extractionRes.text();
        if (!text || typeof text !== 'string') {
        console.error('Extraction did not return valid text:', text);
        return NextResponse.json({ error: 'Extraction did not return valid text' }, { status: 500 });
        }


        // Call the BookNLP endpoint with the extracted text (absolute URL required)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const booknlpUrl = `${baseUrl}/api/booknlp/${book_id}`;
        const booknlpRes = await fetch(booknlpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        });

        if (!booknlpRes.ok) {
        console.error('BookNLP processing failed:', await booknlpRes.text());
        return NextResponse.json({ error: 'BookNLP processing failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
    }
