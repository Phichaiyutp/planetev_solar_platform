"use client"
import React, { useEffect, useState } from "react";
import Card from "./ui/card";
import CardDouble from "./ui/card_double";

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

const GetOverallData = () => {
  const [overall, setOverall] = useState<OverallItem>();
  const callAPI = () => {
    fetch('/api/overall').then((res) => res.json())
    .then((data) => {
      if (data) {
        setOverall(data);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    const MINUTE_MS = 60*5*1000;
    callAPI(); 
    const interval = setInterval(() => {
      callAPI();
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, []);

  return overall;
};

export const EnergyOverall: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Energy Overall' value={overall?.energy_overall || 0} unit="kWh" text="font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success"/>
  );
};

export const RevenueOverall: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Revenue Overall' value={overall?.revenue_total || 0} unit="THB" text="font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary"/>
  );
};

export const Monthly: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Monthly: Energy / Revenue' 
    value={overall?.energy_overall || 0} 
    unit="kWh" 
    text="font-bold text-4xl xl:text-3xl text-success"
    second_value={overall?.revenue_total || 0} 
    second_unit="THB" 
    second_text="font-bold text-4xl xl:text-3xl text-primary"/>
  );
};

export const TotalOffPeak: React.FC = () => {
  const overall = GetOverallData();
  return (
    <CardDouble title='Total Off Peak' 
    value={overall?.total_off_peak || 0} 
    unit="kWh" 
    text="font-bold text-2xl xl:text-3xl 2xl:text-5xl  text-success"
    second_value={overall?.revenue_off || 0} 
    second_unit="THB" 
    second_text="font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary"/>
  );
};

export const TotalOnPeak: React.FC = () => {
  const overall = GetOverallData();
  return (
    <CardDouble title='Total On Peak' 
    value={overall?.total_on_peak || 0} 
    unit="kWh" 
    text="font-bold text-2xl xl:text-3xl 2xl:text-5xl text-success"
    second_value={overall?.revenue_on || 0} 
    second_unit="THB" 
    second_text="font-bold text-2xl xl:text-3xl 2xl:text-5xl text-primary"/>
  );
};

export const RealtimePV: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Real-time PV' value={overall?.realtime_pv || 0} unit="kW" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-5xl"/>
  );
};

export const YieldToday: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Yield Today' value={overall?.yield_today || 0} unit="kWh" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-5xl"/>
  );
};

export const ConsumpionToday: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Consumpion Today' value={overall?.total_yield || 0} unit="kWh" bg="bg-primary" text="font-bold text-2xl xl:text-3xl 2xl:text-5xl"/>
  );
};

export const TotalCo2: React.FC = () => {
  const overall = GetOverallData();
  return (
    <Card title='Total CO2 Avoided' value={overall?.co2 || 0} unit="Tons" bg="bg-secondary"  text="font-bold text-2xl xl:text-3xl 2xl:text-5xl"/>
  );
};



