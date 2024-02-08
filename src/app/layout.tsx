import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PlanetEV Solar Platform",
  description: "PlanetEV Solar Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="mytheme" lang="en">
      <body className={inter.className}>
      <div className="fixed top-0 left-0 w-full bg-success h-4 z-50"></div>
        {children}
      </body>
    </html>
  );
}
