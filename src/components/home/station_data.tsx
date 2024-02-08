"use client"
import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

interface StationItem {
  realtime_pv: number;
  station_code: number;
  station_name: number;
  station_name_short: number;
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
}

const GetStationData = () => {
  const [station, setStation] = useState<StationItem[]>([]);
  const callAPI = () => {
    fetch('/api/station')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStation(data);
        } else {
          console.log(data);
        }
      });
  };

  useEffect(() => {
    const MINUTE_MS = 60 * 5 * 1000;
    callAPI();
    const interval = setInterval(() => {
      callAPI();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);

  return station;
};


export const StationStatus = () => {
  const station = GetStationData();
  return (
    <div>
      <p className="font-bold text-xl text-success ">Plant</p> 
      {station.map((item,index) => (
        <div key={index}>
          <div className="flex justify-between mt-2">
            <p className="w-11/12">{item.station_name_short}</p>
            <p className={`w-1/12 text-end ${item.station_status == 'Online' ? "text-green-500" : "text-red-500"}`}>{item.station_status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TotalEnergyChart: React.FC = () => {
  const station = GetStationData();
  Chart.register(CategoryScale);
  const labels = station.map(item => item.station_name_short);
  const data = station.map(item => item.yield_today);
  const unitData = 'kWh'
  const dataofchart = {
    labels: labels,
    datasets: [
      {
        label: 'Energy',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options:any= {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' 
      },
      tooltip: {
        callbacks: {
          label: function(context:any) {
            if (context.parsed.y !== null) {
              const label = `${context.dataset.label || ''} : ${context.formattedValue} ${unitData}`;
              return label;
            }
          }
        }
      } 
    }
  };

  return (
    <div className="w-full">
      <Pie   height="400px" width="1000px" data={dataofchart} options={options} />
    </div>
  );
};


