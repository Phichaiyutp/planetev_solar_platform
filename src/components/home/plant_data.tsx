"use client"
import React, { useEffect, useState } from "react";
import axios from 'axios';

interface PlantItem {
  realtime_pv: number;
  station_code: number;
  timestamp: string;
  yield_today: number;
  total_yield: number;
  plant_status: string;
  co2: number;
  realtime_grid: number;
  energy: number;
  revenue: number;
  realtime_load: number;
}

const PlantStatus = () => {
  const [plant, setPlant] = useState<PlantItem[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/plant").then((res) => {
      const data = res.data;
      if (data) {
        console.log(data);
        setPlant(data);
      } else {
        console.log(data);
      }
    });
  }, []);

  return (
    <div>
      {plant.map((item,index) => (
        <div key={index}>
          <div className="flex justify-between">
            <p className="">{item.station_code}</p>
            <p className={item.plant_status == 'Online' ? "text-green-500" : "text-red-500"}>{item.plant_status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantStatus;
