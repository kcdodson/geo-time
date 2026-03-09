"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Registration failed");
      return;
    }

    router.push("/login?registered=1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
            style={{ background: "var(--color-amber)", boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>GeoTime</h1>
          <p style={{ color: "var(--color-text-dim)" }} className="mt-1">Create your account</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-dim)" }}>Name</label>
              <input
                {...register("name")}
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                style={{
                  background: "var(--color-surface-2)",
                  border: errors.name ? "1px solid var(--color-red)" : "1px solid var(--color-border)",
                }}
                placeholder="Jane Smith"
              />
              {errors.name && <p className="mt-1 text-sm" style={{ color: "var(--color-red)" }}>{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-dim)" }}>Email</label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                style={{
                  background: "var(--color-surface-2)",
                  border: errors.email ? "1px solid var(--color-red)" : "1px solid var(--color-border)",
                }}
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-1 text-sm" style={{ color: "var(--color-red)" }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-dim)" }}>Password</label>
              <input
                {...register("password")}
                type="password"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 outline-none"
                style={{
                  background: "var(--color-surface-2)",
                  border: errors.password ? "1px solid var(--color-red)" : "1px solid var(--color-border)",
                }}
                placeholder="Min 8 characters"
              />
              {errors.password && <p className="mt-1 text-sm" style={{ color: "var(--color-red)" }}>{errors.password.message}</p>}
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--color-red)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg font-semibold text-black transition-all disabled:opacity-50"
              style={{ background: "var(--color-amber)", fontFamily: "var(--font-heading)" }}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-dim)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-amber)" }} className="font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
