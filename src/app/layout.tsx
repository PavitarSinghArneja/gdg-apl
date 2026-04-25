import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Draft Without Damage | Send the email. Keep the job.",
  description: "Translate human into HR-approved. Because burnout shouldn't damage your career.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
