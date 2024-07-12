import { StationItem, OverallItem } from "../interface";

export async function GetStationData(): Promise<StationItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/dashboard/station`,{ next: { revalidate: 3600 } });
  const data = await res.json();
  return data;
}

export async function GetOverallData(): Promise<OverallItem> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/api/dashboard/overall`,
    { next: { revalidate: 3600 } }
  );
  const data = await res.json();
  return data;
}
