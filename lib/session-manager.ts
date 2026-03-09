import { db } from "@/lib/db";
import { EntrySource } from "@prisma/client";

const STALE_SESSION_HOURS = 12;

export async function startSession(
  userId: string,
  source: EntrySource = "MANUAL",
  locationLat?: number,
  locationLng?: number
) {
  // Close any stale open sessions first
  await closeStale(userId);

  // Check for existing active session
  const existing = await db.timeEntry.findFirst({
    where: { userId, endTime: null },
  });
  if (existing) return existing;

  return db.timeEntry.create({
    data: {
      userId,
      startTime: new Date(),
      source,
      locationLat,
      locationLng,
    },
  });
}

export async function stopSession(
  sessionId: string,
  userId: string,
  locationLat?: number,
  locationLng?: number
) {
  const session = await db.timeEntry.findFirst({
    where: { id: sessionId, userId, endTime: null },
  });
  if (!session) return null;

  const endTime = new Date();
  const duration = Math.floor(
    (endTime.getTime() - session.startTime.getTime()) / 1000
  );

  return db.timeEntry.update({
    where: { id: sessionId },
    data: {
      endTime,
      duration,
      locationLat: locationLat ?? session.locationLat,
      locationLng: locationLng ?? session.locationLng,
    },
  });
}

export async function closeStale(userId: string) {
  const cutoff = new Date(Date.now() - STALE_SESSION_HOURS * 3600 * 1000);
  const stale = await db.timeEntry.findMany({
    where: { userId, endTime: null, startTime: { lt: cutoff } },
  });

  for (const session of stale) {
    const endTime = new Date(
      session.startTime.getTime() + STALE_SESSION_HOURS * 3600 * 1000
    );
    const duration = STALE_SESSION_HOURS * 3600;
    await db.timeEntry.update({
      where: { id: session.id },
      data: { endTime, duration },
    });
  }
  return stale.length;
}

export async function detectConflicts(
  userId: string,
  startTime: Date,
  endTime: Date | null,
  excludeId?: string
) {
  const where = {
    userId,
    id: excludeId ? { not: excludeId } : undefined,
    OR: [
      {
        startTime: { lt: endTime ?? new Date() },
        endTime: { gt: startTime },
      },
      {
        startTime: { lt: endTime ?? new Date() },
        endTime: null,
      },
    ],
  };
  return db.timeEntry.findMany({ where });
}

export async function mergeSessions(
  userId: string,
  sessionIds: string[]
) {
  const sessions = await db.timeEntry.findMany({
    where: { userId, id: { in: sessionIds } },
    orderBy: { startTime: "asc" },
  });

  if (sessions.length < 2) throw new Error("Need at least 2 sessions to merge");

  const startTime = sessions[0].startTime;
  const lastSession = sessions[sessions.length - 1];
  const endTime = lastSession.endTime;
  const duration = endTime
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    : null;

  const notes = sessions
    .map((s) => s.notes)
    .filter(Boolean)
    .join(" | ");

  const merged = await db.timeEntry.create({
    data: {
      userId,
      startTime,
      endTime,
      duration,
      source: "MANUAL",
      notes: notes || null,
    },
  });

  await db.timeEntry.deleteMany({
    where: { id: { in: sessionIds } },
  });

  return merged;
}
