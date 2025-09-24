import { NextResponse } from "next/server";
import { db, userProfiles } from "@/lib/db";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
  }

  try {
    const allUserProfiles = await db.select().from(userProfiles);
    return NextResponse.json(allUserProfiles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch user profiles" }, { status: 500 });
  }
}
