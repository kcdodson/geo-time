import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authSession = await auth();
  if (!authSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to dates are required" }, { status: 400 });
  }

  const sessions = await db.timeEntry.findMany({
    where: {
      userId: authSession.user.id,
      startTime: { gte: new Date(from), lte: new Date(to) },
    },
    orderBy: { startTime: "asc" },
  });

  const totalSeconds = sessions.reduce((sum, s) => {
    const dur = s.duration ?? (s.endTime
      ? Math.floor((s.endTime.getTime() - s.startTime.getTime()) / 1000)
      : 0);
    return sum + dur;
  }, 0);

  return NextResponse.json({ sessions, totalSeconds });
}
