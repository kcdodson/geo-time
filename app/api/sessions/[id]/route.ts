import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { timeEntrySchema } from "@/lib/validations";
import { detectConflicts } from "@/lib/session-manager";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = timeEntrySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const existing = await db.timeEntry.findFirst({ where: { id, userId: authSession.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { startTime, endTime, ...rest } = parsed.data;
  const start = startTime ? new Date(startTime) : existing.startTime;
  const end = endTime !== undefined ? (endTime ? new Date(endTime) : null) : existing.endTime;

  const conflicts = await detectConflicts(authSession.user.id, start, end, id);
  if (conflicts.length > 0) {
    return NextResponse.json({ error: "Overlapping sessions detected", conflicts }, { status: 409 });
  }

  const duration = end ? Math.floor((end.getTime() - start.getTime()) / 1000) : null;

  const entry = await db.timeEntry.update({
    where: { id },
    data: { startTime: start, endTime: end, duration, ...rest },
  });

  return NextResponse.json({ session: entry });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await db.timeEntry.findFirst({ where: { id, userId: authSession.user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.timeEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
