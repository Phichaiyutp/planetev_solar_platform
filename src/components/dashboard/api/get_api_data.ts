
interface StationItem {
  realtime_pv: number;
  capacity: number;
  station_code: number;
  station_name: string; 
  station_name_short: string;
  station_address: number;
  timestamp: string;
  yield_today: number;
  total_yield: number;
  station_status: string;
  co2: number;
  realtime_grid: number;
  energy: number;
  revenue: number;
  realtime_load: number;
  cond: string;
  cond_id: number;
  rh: number;
  tc: number;
}

interface OverallItem {
  realtime_pv: number;
  yield_today: number;
  total_yield: number;
  co2: number;
  total_on_peak: number;
  total_off_peak: number;
  energy_overall: number;
  revenue_total: number;
  revenue_on: number;
  revenue_off: number;
}

export  async function GetStationData(): Promise<StationItem[]> {
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/dashboard/station`,{ next: { revalidate: 3600 } });
const data = await res.json();
return data;
}

export  async function GetOverallData(): Promise<OverallItem> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/dashboard/overall`,{ next: { revalidate: 3600 } });
  const data = await res.json();
  return data;
  }