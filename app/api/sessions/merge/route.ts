import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { mergeSessions } from "@/lib/session-manager";

export async function POST(req: NextRequest) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { sessionIds } = body;

  if (!Array.isArray(sessionIds) || sessionIds.length < 2) {
    return NextResponse.json({ error: "Provide at least 2 session IDs" }, { status: 400 });
  }

  try {
    const merged = await mergeSessions(authSession.user.id, sessionIds);
    return NextResponse.json({ session: merged }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Merge failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
