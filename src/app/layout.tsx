import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import PlantStatus from "@/components/home/plant_data";

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
        <main>
        <div className="drawer lg:drawer-open h-screen">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          {children}
          <div className="drawer-side h-full">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex flex-col p-4 w-80 min-h-full bg-base-100 text-base-content border-r">
              <div className="flex items-start justify-center my-4">
                <Image
                  src="/next.svg"
                  width={200}
                  height={200}
                  alt="Picture of the author"
                />
              </div>
              <PlantStatus />
              <div className="flex items-start justify-start my-4">
                <p>Report/Billing</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
    </html>
  );
}
