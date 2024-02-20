import Image from "next/image";
import {GetUuserInfo} from './action'
import {TotalEnergyChart,StationInfo} from "@/components/dashboard/station";
import { EnergyOverall, RevenueOverall, Monthly, 
  TotalOffPeak,TotalOnPeak,RealtimePV,
  YieldToday,ConsumpionToday,TotalCo2 } from "@/components/dashboard/overall";

export default async  function Home() {
  const user = await GetUuserInfo();
  console.log(user.username)
  return (
    <div className=" m-6 grid grid-cols-2 lg:grid-cols-8 gap-4">
      <label htmlFor="my-drawer-2" className="btn btn-primary btn-xs drawer-button col-span-2 lg:hidden">=</label>
        <p className="h-20 w-fit text-base-300 col-span-2 lg:col-span-6 lg:font-bold text-2xl xl:text-4xl 2xl:text-5xl">SOLAR SUMMARY DASHBOARD</p>
        <div className="h-20 text-lg hidden lg:flex lg:col-span-2 lg:text-xl 2xl:text-3xl">
          <p className="pt-6 pr-4 text-end w-full align-middle text-base-500 capitalize xl:pl-30">{user.username}</p>
          <Image src={`data:image/jpeg;base64,${user.avatar}`} width={80} height={80} alt='avatar' />
        </div>
        <div className="w-auto col-span-2 lg:flex lg:col-span-8">
          <div className="w-full  mt-2 lg:w-1/3 lg:mr-2">
            <EnergyOverall />
          </div>
          <div className="w-full  mt-2 lg:w-1/3 lg:ml-2 lg:mr-2">
            <RevenueOverall />
          </div>
          <div className="w-full  mt-2 lg:w-1/3 lg:ml-2">
            <Monthly />
          </div>
        </div>
        <div className="w-auto  col-span-2 lg:col-span-4">
            <TotalOffPeak />
        </div>
        <div className="w-auto  col-span-2 lg:col-span-4">
            <TotalOnPeak />
        </div>
        <div className="w-auto  lg:col-span-4 xl:col-span-2">
            <RealtimePV />
        </div>
        <div className="w-auto  lg:col-span-4 xl:col-span-2">
            <YieldToday />
        </div>
        <div className="w-auto  lg:col-span-4 xl:col-span-2">
            <ConsumpionToday />
        </div>
        <div className="w-auto  lg:col-span-4 xl:col-span-2">
            <TotalCo2 />
        </div>
        <p className="w-auto pt-4  font-bold col-span-2 lg:col-span-8 lg:m-4 text-2xl xl:text-3xl 2xl:text-4xl">Total Energy</p>
        <div className="w-auto col-span-2 lg:col-span-8 flex justify-center">
            <TotalEnergyChart />
        </div>
        <div className="w-auto pt-8  lg:col-span-8">
            <StationInfo />
        </div>
    </div>
  );
}
