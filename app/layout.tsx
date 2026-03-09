import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoTime – Location-Based Work Tracker",
  description: "Automatically track your work hours via geofencing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
