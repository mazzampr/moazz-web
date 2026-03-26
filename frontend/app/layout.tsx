import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOAZZ - Creative Developer & Designer",
  description: "Full-stack Mobile developer and designer crafting digital experiences that blend aesthetics with functionality.",
  icons: {
    icon: '/images/moazz-logo.png',
    shortcut: '/images/moazz-logo.png',
    apple: '/images/moazz-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
