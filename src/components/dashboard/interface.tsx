
export interface StationItem {
    timestamp: string
    station_code: number
    station_status: string
    co2: number
    capacity: number
    latitude: number
    longitude: number
    station_name: string
    station_address: string
    station_name_short: string
    condEn: string
    condDescription: string
    cond_id: number
    cond_icon: string
    rh: number
    tc: number
    realtime_pv: number
    energy: number
    yield_today: number
    total_yield: number
    realtime_grid: number
    total_on_peak: number
    total_off_peak: number
    energy_overall: number
    revenue_total: number
    revenue_on: number
    revenue_off: number
    realtime_load: number
}

export  interface OverallItem {
    timestamp: string
    realtime_pv: number
    yield_today: number
    total_yield: number
    co2: number
    total_on_peak: number
    total_off_peak: number
    energy_overall: number
    revenue_total: number
    revenue_on: number
    revenue_off: number
}