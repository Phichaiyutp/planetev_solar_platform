import Image from "next/image";
import { Inter } from "next/font/google";
import "../globals.css";
import {StationStatus,ExportReport} from "@/components/dashboard/station";
import Logout from "@/components/logout/logout";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="mytheme" lang="en">
      <body className={inter.className}>
      <div className="fixed top-0 left-0 w-full bg-success h-4 z-50"></div>
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content mt-4 mx-auto w-11/12">
        {children}
      </div>
      <div className="drawer-side">
      <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
      <div className="menu px-4 w-auto h-full bg-base-100 text-base-content border-r-[2px] border-success">
        <div className="flex flex-col">
          <div className="flex items-start justify-center my-4">
            <Image
              src="/logo.png"
              width={384/2}
              height={216/2}
              alt="Picture of the author"
            />
          </div>
          <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
          <div className="mx-4 p-4"><StationStatus /></div>
          <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
          <div className="mx-4 p-4"><ExportReport /></div>
          <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
          <div className="pl-12"><Logout /></div>
        </div>
      </div>
      </div>
    </div>
      </body>
    </html>
  );
}
