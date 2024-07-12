"use client"
import React, { useEffect, useState } from "react";
import Card from "./ui/card";
import CardDouble from "./ui/card_double";
import {GetOverallData} from "./api/get_api_data";
import {StationItem,OverallItem} from './interface'


const FetchData: React.FC<{ children: (overall: OverallItem | undefined) => React.ReactNode }> = ({ children }) => {
  const [overall, setOverall] = useState<OverallItem>();
  const [loading, setLoading] = useState<boolean>(true);

  const callAPI = async () => {
    try {
      const data = await GetOverallData();
      setOverall(data);
    } catch (error) {
      console.error("Error fetching station data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const MINUTE_MS = 60 * 5 * 1000;
    callAPI();
    const interval = setInterval(() => {
      callAPI();
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    loading ? 
    <div>
        <Card
          title="Loading..."
          value={'0.0'}
          unit=""
          text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-success"
        />
    </div> : children(overall));
};

export const EnergyOverall: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card
          title="Energy Overall"
          value={Number(overall?.energy_overall.toFixed(2)).toLocaleString() || '0'}
          unit="kWh"
          text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-success"
        />
      )}
    </FetchData>
  );
};

export const RevenueOverall: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Revenue Overall' value={Number(overall?.revenue_total.toFixed(2)).toLocaleString() || '0'} unit="THB" text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-primary"/>
      )}
    </FetchData>
  );
};

export const Monthly: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Monthly: Energy / Revenue' 
    value={Number(overall?.energy_overall.toFixed(2)).toLocaleString() || '0'} 
    unit="kWh" 
    text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-success"
    second_value={Number(overall?.revenue_total.toFixed(2)).toLocaleString() || '0'} 
    second_unit="THB" 
    second_text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-primary"/>
      )}
    </FetchData>
  );
};

export const TotalOffPeak: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <CardDouble title='Total Off Peak' 
    value={Number(overall?.total_off_peak.toFixed(2)).toLocaleString() || '0'} 
    unit="kWh" 
    text="font-bold text-2xl xl:text-3xl 2xl:text-4xl  text-success"
    second_value={Number(overall?.revenue_off.toFixed(2)).toLocaleString() || '0'} 
    second_unit="THB" 
    second_text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-primary"/>
      )}
    </FetchData>
  );
};

export const TotalOnPeak: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <CardDouble title='Total On Peak' 
    value={Number(overall?.total_on_peak.toFixed(2)).toLocaleString() || '0'} 
    unit="kWh" 
    text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-success"
    second_value={Number(overall?.revenue_on.toFixed(2)).toLocaleString() || '0'} 
    second_unit="THB" 
    second_text="font-bold text-2xl xl:text-3xl 2xl:text-4xl text-primary"/>
      )}
    </FetchData>
  );
};

export const RealtimePV: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Real-time PV' value={Number(overall?.realtime_pv.toFixed(2)).toLocaleString() || '0'} unit="kW" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-4xl"/>
      )}
    </FetchData>
  );
};

export const YieldToday: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Yield Today' value={Number(overall?.yield_today.toFixed(2)).toLocaleString() || '0'} unit="kWh" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-4xl"/>
      )}
    </FetchData>
  );
};

export const ConsumpionToday: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Consumpion Today' value={Number(overall?.total_yield.toFixed(2)).toLocaleString() || '0'} unit="kWh" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-4xl"/>
      )}
    </FetchData>
  );
};

export const TotalCo2: React.FC = () => {
  return (
    <FetchData>
      {(overall) => (
        <Card title='Total CO2 Avoided' value={Number(overall?.co2.toFixed(2)).toLocaleString() || '0'} unit="Tons" bg="bg-secondary"  text="font-bold text-2xl xl:text-3xl 2xl:text-4xl"/>
      )}
    </FetchData>
  );
};



