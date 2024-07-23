import Image from "next/image";
import { Inter } from "next/font/google";
import "../globals.css";
import { StationStatus, ExportReport } from "@/components/dashboard/station";
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
          <div className="drawer-side max-h-screen">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="menu px-4 h-full w-11/12 sm:w-8/12 lg:w-5/6 xl:w-11/12  bg-base-100 text-base-content border-r-[2px] border-success overflow-auto">
              <div className="flex flex-col w-11/12 sm:w-full">
                <div className="flex items-start justify-center my-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH}/logo.png`}
                    width={227}
                    height={128}
                    alt="Picture of the author"
                  />
                </div>
                <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
                <div className="mx-4 p-4"><StationStatus /></div>
                <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
                <div className="mx-4 p-4"><ExportReport /></div>
                <div className="bg-success h-[2px] w-[90%] mx-auto"></div>
                <div className="mx-4 pl-8"><Logout /></div>
              </div>
            </div>
          </div>
        </div>
        
      </body>
    </html>
  );
}
