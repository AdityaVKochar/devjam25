'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "../options";
import clientPromise from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || !session.user || !session.user.email) {
    return NextResponse.redirect(new URL("/signin", process.env.NEXTAUTH_URL));
  }

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (user && user.isNew === false) {
    return NextResponse.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL));
  }
  if (user && user.isNew !== false) {
    await db.collection("users").updateOne({ email: session.user.email }, { $set: { isNew: false } });
  }

  return NextResponse.redirect(new URL("/newuserdashboard", process.env.NEXTAUTH_URL));
}
