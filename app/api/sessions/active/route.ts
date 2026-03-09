import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startSession, stopSession, closeStale } from "@/lib/session-manager";

export async function GET() {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await closeStale(authSession.user.id);

  const session = await db.timeEntry.findFirst({
    where: { userId: authSession.user.id, endTime: null },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ session });
}

export async function POST(req: NextRequest) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { source = "MANUAL", locationLat, locationLng } = body;

  const session = await startSession(authSession.user.id, source, locationLat, locationLng);
  return NextResponse.json({ session }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { locationLat, locationLng } = body;

  const activeSession = await db.timeEntry.findFirst({
    where: { userId: authSession.user.id, endTime: null },
    orderBy: { startTime: "desc" },
  });

  if (!activeSession) return NextResponse.json({ error: "No active session" }, { status: 404 });

  const stopped = await stopSession(activeSession.id, authSession.user.id, locationLat, locationLng);
  return NextResponse.json({ session: stopped });
}
