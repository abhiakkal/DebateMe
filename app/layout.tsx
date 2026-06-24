import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Debate Me — AI That Argues Against You",
  description:
    "Type any opinion. The AI takes the opposite side and debates you hard. 5 rounds. Then it scores you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0f] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
