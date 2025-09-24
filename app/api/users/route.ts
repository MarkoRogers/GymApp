// app/api/users/route.ts
import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
  }

  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
