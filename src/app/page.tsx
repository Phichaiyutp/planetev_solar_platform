import Image from "next/image";
import { EnergyOverall, RevenueOverall, Monthly, TotalOffPeak } from "@/components/home/overall";

export default function Home() {
  return (
    <div className="m-6  drawer-content grid grid-cols-1 lg:grid-cols-8 gap-4 max-h-1/2">
      <label htmlFor="my-drawer-2" className="btn btn-primary btn-xs drawer-button lg:hidden">=</label>
      <p className="h-10 w-fit text-base-300 border border-dashed border-red-500 lg:col-span-6 lg:text-4xl">SOLAR SUMMARY DASHBOARD</p>
      <div className="h-10 w-52 flex border border-dashed border-red-500 text-lg lg:col-span-2 lg:text-xl ">
        <p className="my-2 text-base-300">เจ้าหน้าที่ 001</p>
        <Image
          src="/next.svg"
          width={70}
          height={50}
          alt="Picture of the author"
          className="mx-2"
        />
      </div>
      <div className="w-auto lg:flex lg:col-span-8">
        <div className="w-full mt-2 lg:w-1/3 lg:mr-2">
          <EnergyOverall />
        </div>
        <div className="w-full mt-2 lg:w-1/3 lg:ml-2 lg:mr-2">
          <RevenueOverall />
        </div>
        <div className="w-full mt-2 lg:w-1/3 lg:ml-2">
          <Monthly />
        </div>
      </div>
      <div className="w-auto lg:col-span-4">
          <TotalOffPeak />
        </div>
      <div className="w-auto lg:col-span-4">
        <TotalOffPeak />
      </div>
      <div className="w-auto lg:col-span-2">
          <TotalOffPeak />
        </div>
      <div className="w-auto lg:col-span-2">
        <TotalOffPeak />
      </div>
      <div className="w-auto lg:col-span-2">
          <TotalOffPeak />
        </div>
      <div className="w-auto lg:col-span-2">
        <TotalOffPeak />
      </div>
      
    </div>
  );
}
