// app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to your Neon database
    const res = await fetch(process.env.DATABASE_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // This is a placeholder; in reality you will need a Postgres client to query
    });
    
    // For now, just return a test response
    return NextResponse.json([{ id: 1, email: "me@site.com", name: "Me", username: "username" }]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
