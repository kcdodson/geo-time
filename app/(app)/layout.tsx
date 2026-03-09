import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Providers from "@/components/layout/Providers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <Providers>
      <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <Sidebar />
        <main className="ml-16 md:ml-60 pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </Providers>
  );
}
