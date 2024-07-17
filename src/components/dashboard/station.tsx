"use client";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { GetStationData } from "./api/get_api_data";
import Card from "./ui/card_list";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import {StationItem,OverallItem} from './interface'

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
    const MINUTE_MS = 60 * 5 * 1000;
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
      {stations.length === 0 ? (
        <div role="status" className="max-w-sm animate-pulse">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4"
            ></div>
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div>
          {stations.map((item: StationItem, index: number) => (
            <div key={index}>
              <div className="flex justify-between mt-2">
                <p className="w-11/12">{item.station_name_short}</p>
                <p
                  className={`w-1/12 text-end ${
                    item.station_status === "Online"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {item.station_status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TotalEnergyChart: React.FC = () => {
  const stations = FetchData();
  const labels = stations.map((item) => item.station_name_short);
  const data = stations.map((item) => item.yield_today);
  const unitData = "kWh";

  // Chart data and options
  const dataOfChart = {
    labels: labels,
    datasets: [
      {
        label: "Energy",
        data: data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
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
        position: "right", // Default position
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            if (context.parsed.y !== null) {
              const label = `${context.dataset.label || ""} : ${
                context.formattedValue
              } ${unitData}`;
              return label;
            }
          },
        },
      },
    },
  };

  // Update legend position based on screen width
  if (typeof window !== "undefined") {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 640) {
      options.plugins.legend.position = "top";
      options.plugins.legend.labels = {
        boxWidth: 2,
        font: {
          size: 6,
        },
      };
    }
  }

  // Render the component
  return (
    <div className="w-10/12 h-40 sm:h-60 md:h-80 sm:w-8/12">
      <Pie height="auto" width="auto" data={dataOfChart} options={options} />
    </div>
  );
};


export const StationInfo: React.FC = () => {
  const stations = FetchData();
  const rtpv = (realtime_pv:number, capacity:number) => {
    let color = '';
    if (realtime_pv >= 0.7 * capacity) {
        color = 'text-green-500'; 
    } else if (realtime_pv >= 0.3 * capacity){
        color = 'text-yellow-500'; 
    } else {
        color = 'text-red-500'; 
    }
    return color;
  }
  return (
    <div className="flex flex-wrap">
      {stations.map((station, index) => (
        <div key={index} className="flex-auto">
          <Card
            title={station.station_name_short || ""}
            data={[
              {
                valueName: "Energy",
                value: station.energy ? Number(station.energy.toFixed(2)).toLocaleString() : "0",
                unit: "kWh",
              },
              {
                valueName: "Revenue",
                value: station.revenue_total ? Number(station.revenue_total.toFixed(2)).toLocaleString(): "0",
                unit: "THB",
              },
              {
                valueName: "Real-time PV",
                value: station.realtime_pv && station.capacity ? `${Number(station.realtime_pv.toFixed(2)).toLocaleString()} / ${Number(station.capacity.toFixed(2)).toLocaleString()}`: "0",
                unit: "kW",
                color: rtpv(station.realtime_pv, station.capacity)
              },
              {
                valueName: "Real-time PV Ratio",
                value: station.realtime_pv && station.capacity ? Number(((station.realtime_pv/station.capacity)*100).toFixed(2)).toLocaleString(): "0",
                unit: "%",
                color: rtpv(station.realtime_pv, station.capacity)
              },
              {
                valueName: "Real-time Load",
                value: station.realtime_load ?  Number(
                  station.realtime_load.toFixed(2)
                ).toLocaleString(): "0",
                unit: "kW",
              },
              {
                valueName: "Yield Today",
                value: station.yield_today ? Number(station.yield_today.toFixed(2)).toLocaleString(): "0",
                unit: "kWh",
              },
              {
                valueName: "Total Yield",
                value: station.total_yield ? Number(
                  (station.total_yield / 1000).toFixed(2)
                ).toLocaleString(): "0",
                unit: "MWh",
              },
              {
                valueName: "CO2 Avoided",
                value: station.co2?  Number(station.co2.toFixed(2)).toLocaleString(): "0",
                unit: "tons",
              },
              {
                valueName: "Weather",
                unit: station.condDescription || "Clear",
                icon: station.cond_icon || "",
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
  const [downloading, setDownloading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<string>("");

  const handleDateChange = (date: moment.Moment | string) => {
    if (moment.isMoment(date) && date.isValid()) {
      setSelectedYear(date.year());
      setSelectedMonth(date.month() + 1); // Adding 1 because months are zero-indexed
    } else if (typeof date === "string") {
      const parsedDate = moment(date, "YYYY-MM");
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

  const handleSubmit = async  () => {
    try {
      setDownloading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/report?selectedStation=${selectedStation}&selectedYear=${selectedYear}&selectedMonth=${selectedMonth}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `bill_${new Date().toISOString().split('T')[0]}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to fetch Excel file:', response.statusText);
      }
    } catch (error) {
      console.error('Error exporting Excel file:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col text-base">
      <p className="font-bold text-xl text-success">Report/Billing</p>
      <p className="pt-4">Year / Month</p>
      <Datetime
        className="border rounded-lg border-slate-300 leading-9 ml-4 my-4 pl-2 w-fit max-w-60"
        value={
          selectedYear && selectedMonth
            ? moment({ year: selectedYear, month: selectedMonth - 1 })
            : ""
        }
        dateFormat="YYYY-MM"
        timeFormat={false} // Disable time selection
        onChange={(value: string | moment.Moment) => {
          handleDateChange(value);
        }}
        closeOnSelect
        inputProps={{ placeholder: "Select Year and Month", readOnly: true }}
        
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
        className={`btn btn-success btn-md ml-4 mt-4 w-full max-w-60 text-white text-lg font-bold${downloading ? ' disabled' : ''}`}
        onClick={handleSubmit}
        disabled={downloading}
      >
        {downloading ? (
          <>
            <span className="loading loading-spinner"></span>
            Loading...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </div>
  );
};
