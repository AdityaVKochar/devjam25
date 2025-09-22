import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filename = (body?.filename || body?.value?.filename || "uploaded.txt").toString();
    const content = (body?.content || body?.value?.content || "").toString();

    let title = "Untitled";
    if (content) {
      const rawLines: string[] = content.split(/\r?\n/);
      const lines: string[] = [];
      for (const r of rawLines) {
        const t = (r || "").trim();
        if (t) lines.push(t);
      }
      if (lines.length > 0) {
        title = lines[0].slice(0, 120);
      } else {
        title = filename.replace(/\.[^.]+$/, "");
      }
    } else {
      title = filename.replace(/\.[^.]+$/, "");
    }

    return NextResponse.json({ title, filename });
  } catch (err) {
    console.error("booknlp/name error", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
