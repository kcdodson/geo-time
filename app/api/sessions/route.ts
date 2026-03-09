import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { timeEntrySchema } from "@/lib/validations";
import { detectConflicts } from "@/lib/session-manager";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const where: Record<string, unknown> = { userId: session.user.id };
  if (from || to) {
    where.startTime = {};
    if (from) (where.startTime as Record<string, unknown>).gte = new Date(from);
    if (to) (where.startTime as Record<string, unknown>).lte = new Date(to);
  }

  const [sessions, total] = await Promise.all([
    db.timeEntry.findMany({
      where,
      orderBy: { startTime: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.timeEntry.count({ where }),
  ]);

  return NextResponse.json({ sessions, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = timeEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { startTime, endTime, ...rest } = parsed.data;
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : null;

  const conflicts = await detectConflicts(session.user.id, start, end);
  if (conflicts.length > 0) {
    return NextResponse.json({ error: "Overlapping sessions detected", conflicts }, { status: 409 });
  }

  const duration = end ? Math.floor((end.getTime() - start.getTime()) / 1000) : null;

  const entry = await db.timeEntry.create({
    data: {
      userId: session.user.id,
      startTime: start,
      endTime: end,
      duration,
      ...rest,
    },
  });

  return NextResponse.json({ session: entry }, { status: 201 });
}
