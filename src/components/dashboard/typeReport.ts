export interface Item {
  peopleInvolved?: peopleInvolved;
  billPeriod: string;
  summaryDateForm: string;
  summaryDateTo: string;
  stations: Station[];
}

export interface Station {

  stationId: number;
  name: string;
  yield: number;
  amount: number;
  details: Details;
}

export interface peopleInvolved {
  eng: string,
  pm: string,
  inspector:string,
}

export interface Details {
  date: string;
  tariff: string;
  project: string;
  location: string;
  preparedBy: string;
  capacity: number;
  summaryDateForm: string;
  summaryDateTo: string;
  voltRate: string;
  discount: string;
  ft: number;
  billPeriod: string;
  amount: number;
  offPeak?: number;
  onPeak?: number;
  offPeakRate?: number;
  onPeakRate?: number;
  offPeakRateDsc?: number;
  onPeakRateDsc?: number;
  offPeakAmount?: number;
  onPeakAmount?: number;
  total: number;
  consumption: number;
  daily: Daily[];
  devices: Device[];
  chartEndpoint?: string;
  eRateMinTotal?: number;
  eRateMidTotal?: number;
  eRateMaxTotal?: number;
  eRateMinAmount?: number;
  eRateMidAmount?: number;
  eRateMaxAmount?: number;
  eRateMin?: number;
  eRateMid?: number;
  eRateMax?: number;
  eRateMinDsc?: number;
  eRateMidDsc?: number;
  eRateMaxDsc?: number;
}

export interface Daily {
  date: string;
  offPeak?: number;
  onPeak?: number;
  total: number;
  consumption: number;
}

export interface Device {
  name: string;
  deviceType: string;
  exd_warranty?: string;
}
