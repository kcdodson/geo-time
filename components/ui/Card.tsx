import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export default function Card({ children, className = "", padding = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl ${padding ? "p-6" : ""} ${className}`}
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      {...props}
    >
      {children}
    </div>
  );
}
