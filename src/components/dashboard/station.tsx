'use client'
import React, { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import {GetStationData} from "./api/get_api_data";
import Card from "./ui/card_list";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

// Define the interface for StationItem
interface StationItem {
  realtime_pv: number;
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

// Register CategoryScale only once
Chart.register(CategoryScale);

const FetchData = () => {
  const [stations, setStations] = useState<StationItem[]>([]);
  const callAPI = async () => {
    try {
      const data = await GetStationData();
      setStations(data);
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };
  
  useEffect(() => {
    const MINUTE_MS = 60*5*1000;
    callAPI(); 
    const interval = setInterval(() => {
      callAPI();
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, []);

  return stations;
};

export const StationStatus: React.FC = () => {
  const stations = FetchData();

  return (
    <div>
      <p className="font-bold text-xl text-success">Plant</p>
      {stations.map((item: StationItem, index: number) => (
        <div key={index}>
          <div className="flex justify-between mt-2">
            <p className="w-11/12">{item.station_name_short}</p>
            <p className={`w-1/12 text-end ${item.station_status === 'Online' ? "text-green-500" : "text-red-500"}`}>{item.station_status}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TotalEnergyChart: React.FC = () => {
  const stations = FetchData();
  const labels = stations.map(item => item.station_name_short);
  const data = stations.map(item => item.yield_today);
  const unitData = 'kWh';

  // Chart data and options
  const dataOfChart = {
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

  // Chart options
  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' 
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            if (context.parsed.y !== null) {
              const label = `${context.dataset.label || ''} : ${context.formattedValue} ${unitData}`;
              return label;
            }
          }
        }
      } 
    }
  };

  // Render the component
  return (
    <div className="sm:w-full  lg:w-1/2">
      <Pie height="320vh" width="640vw" data={dataOfChart} options={options} />
    </div>
  );
};


export const StationInfo: React.FC = () => {
  const stations = FetchData();
  return (
    <div className="flex flex-wrap">
      {stations.map((station, index) => (
        <div key={index} className="flex-auto">
          <Card
            title={station.station_name_short || ""}
            data={[
              {
                valueName: "Energy",
                value: Number(station.energy.toFixed(2)).toLocaleString(),
                unit: "kWh",
              },
              {
                valueName: "Revenue",
                value: Number(station.revenue.toFixed(2)).toLocaleString(),
                unit: "THB",
              },
              {
                valueName: "Real-time PV",
                value: Number(station.realtime_pv.toFixed(2)).toLocaleString(),
                unit: "kW",
              },
              {
                valueName: "Real-time Load",
                value: Number(station.realtime_load.toFixed(2)).toLocaleString(),
                unit: "kW",
              },
              {
                valueName: "Yield Today",
                value: Number(station.yield_today.toFixed(2)).toLocaleString(),
                unit: "kWh",
              },
              {
                valueName: "Total Yield",
                value: Number((station.total_yield/1000).toFixed(2)).toLocaleString(),
                unit: "MWh",
              },
              {
                valueName: "CO2 Avoided",
                value: Number(station.co2.toFixed(2)).toLocaleString(),
                unit: "tons",
              },
              {
                valueName: "Weather",
                unit:station.cond,
                icon_id:station.cond_id
              },
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export const ExportReport: React.FC = () => {
  const stations = FetchData();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<string>('');

  const handleDateChange = (date: moment.Moment | string) => {
    if (moment.isMoment(date) && date.isValid()) {
      setSelectedYear(date.year());
      setSelectedMonth(date.month() + 1); // Adding 1 because months are zero-indexed
    } else if (typeof date === 'string') {
      const parsedDate = moment(date, 'YYYY-MM');
      if (parsedDate.isValid()) {
        setSelectedYear(parsedDate.year());
        setSelectedMonth(parsedDate.month() + 1);
      } else {
        setSelectedYear(null);
        setSelectedMonth(null);
      }
    } else {
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  };

  const handleStationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStation(event.target.value);
  };

  const handleSubmit = () => {
    // Construct URL for download
    const hostReport = process.env.NEXT_PUBLIC_HOST_REPORT || 'localhost';
    const hostPortReport = process.env.NEXT_PUBLIC_HOST_PORT_REPORT || 5000;
    const url = `http://${hostReport}:${hostPortReport}/download/xlsx/${selectedStation}?year=${selectedYear}&month=${selectedMonth}`;
    
    // Trigger download
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col text-base">
      <p className="font-bold text-xl text-success">Report/Billing</p>
      <p className="pt-4">Year / Month</p>
      <Datetime
        className="select select-bordered ml-4 my-4 w-full max-w-60"
        value={
          selectedYear && selectedMonth
            ? moment({ year: selectedYear, month: selectedMonth - 1 })
            : ''
        }
        dateFormat="YYYY-MM"
        timeFormat={false} // Disable time selection
        onChange={(value) => {
          handleDateChange(value);
        }}
        inputProps={{ placeholder: 'Select Year and Month' }}
      />
      <p>Plant</p>
      <select
        className="select select-bordered ml-4 mt-4 w-full max-w-60"
        value={selectedStation}
        onChange={handleStationChange}
      >
        <option value="" disabled>
          Please select a plant
        </option>
        {stations.map((station) => (
          <option key={station.station_code} value={station.station_code}>
            {station.station_name}
          </option>
        ))}
      </select>
      <button
        className="btn btn-success btn-md ml-4 mt-4 w-full max-w-60 text-white text-lg font-bold"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};