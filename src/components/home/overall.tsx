"use client"
import React, { useEffect, useState } from "react";
import axios from 'axios';
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

const useOverallData = () => {
  const [overall, setOverall] = useState<OverallItem>();

  useEffect(() => {
    axios.get("http://localhost:3000/api/overall").then((res) => {
      const data = res.data;
      if (data) {
        console.log(data);
        setOverall(data);
      } else {
        console.log(data);
      }
    });
  }, []);

  return overall;
};

export const EnergyOverall: React.FC = () => {
  const overall = useOverallData();
  return (
    <Card title='Energy Overall' value={overall?.energy_overall || 0} unit="kWh" text="font-bold text-5xl text-success"/>
  );
};

export const RevenueOverall: React.FC = () => {
  const overall = useOverallData();
  return (
    <Card title='Revenue Overall' value={overall?.revenue_total || 0} unit="THB" text="font-bold text-5xl text-primary"/>
  );
};

export const Monthly: React.FC = () => {
  const overall = useOverallData();
  return (
    <Card title='Monthly: Energy / Revenue' 
    value={overall?.energy_overall || 0} 
    unit="kWh" 
    text="font-bold text-4xl text-success"
    second_value={overall?.revenue_total || 0} 
    second_unit="THB" 
    second_text="font-bold text-4xl text-primary"/>
  );
};

export const TotalOffPeak: React.FC = () => {
  const overall = useOverallData();
  return (
    <CardDouble title='Revenue Overall' value={overall?.revenue_total || 0} unit="THB" text="font-bold text-5xl text-primary"/>
  );
};