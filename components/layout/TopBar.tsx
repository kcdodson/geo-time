"use client";

import { useSession } from "next-auth/react";

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { data: session } = useSession();
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header
      className="fixed top-0 left-16 md:left-60 right-0 h-16 flex items-center justify-between px-6 z-30"
      style={{ background: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}
    >
      <h1 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-black"
          style={{ background: "var(--color-amber)", fontFamily: "var(--font-mono)" }}>
          {initials}
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-white leading-tight">{session?.user?.name ?? "User"}</p>
          <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>{session?.user?.email}</p>
        </div>
      </div>
    </header>
  );
}
