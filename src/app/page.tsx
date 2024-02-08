import Image from "next/image";
import {StationStatus,TotalEnergyChart} from "@/components/home/station_data";
import { EnergyOverall, RevenueOverall, Monthly, 
  TotalOffPeak,TotalOnPeak,RealtimePV,
  YieldToday,ConsumpionToday,TotalCo2 } from "@/components/home/overall_data";

export default function Home() {
  return (
    <div className="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
    <div className="drawer-content mt-4 mx-auto w-11/12">
      <div className=" m-6 grid grid-cols-1 lg:grid-cols-8 gap-4 max-h-1/2">
        <label htmlFor="my-drawer-2" className="btn btn-primary btn-xs drawer-button lg:hidden">=</label>
        <p className="h-20 w-fit text-base-300 lg:col-span-6 lg:font-bold text-2xl xl:text-4xl 2xl:text-5xl">SOLAR SUMMARY DASHBOARD</p>
        <div className="h-20 w-52 flex border border-dashed border-red-500 text-lg lg:col-span-2 lg:text-xl ">
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
            <TotalOnPeak />
        </div>
        <div className="w-auto lg:col-span-2">
            <RealtimePV />
        </div>
        <div className="w-auto lg:col-span-2">
            <YieldToday />
        </div>
        <div className="w-auto lg:col-span-2">
            <ConsumpionToday />
        </div>
        <div className="w-auto lg:col-span-2">
            <TotalCo2 />
        </div>
        <p className="w-auto  font-bold text-5xl lg:col-span-8 lg:m-4 xl:text-3xl">Total Energy</p>
        <div className="w-auto lg:col-span-8 flex justify-center">
            <TotalEnergyChart />
        </div>
      </div>
    </div>
     <div className="drawer-side">
     <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
     <div className="menu p-4 w-auto h-full bg-base-100 text-base-content">
      <div className="flex flex-col h-full  border-r">
        <div className="flex items-start justify-center my-4">
          <Image
            src="/logo_planetev.jpg"
            width={806/4}
            height={453/4}
            alt="Picture of the author"
          />
        </div>
        <div className="pr-4 mx-4"><StationStatus /></div>
        <div className="flex items-start justify-start my-4 px-4">
          <p>Report/Billing</p>
        </div>
       </div>
     </div>
   </div>
 
 </div>
  );
}
