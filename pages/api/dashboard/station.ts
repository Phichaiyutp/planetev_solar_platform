import type { NextApiRequest, NextApiResponse } from "next";
import pool from "@/db/pg";

function EncodeStationStatus(code: number): string {
  let status: string;
  switch (code) {
    case 1:
      status = "Offline";
      break;
    case 2:
      status = "Faulty";
      break;
    case 3:
      status = "Online";
      break;
    default:
      status = "Unknown";
      break;
  }
  return status;
}

function EncodeWeatherCondition(code: number): string {
  let status: string;
  switch (code) {
    case 1:
      status = "Clear";
      break;
    case 2:
      status = "Partly cloudy";
      break;
    case 3:
      status = "Cloudy";
      break;
    case 4:
      status = "Overcast";
      break;
    case 5:
      status = "Light rain";
      break;
    case 6:
      status = "Moderate rain";
      break;
    case 7:
      status = "Heavy rain";
      break;
    case 8:
      status = "Thunderstorm";
      break;
    case 9:
      status = "Very cold";
      break;
    case 10:
      status = "Cold";
      break;
    case 11:
      status = "Cool";
      break;
    case 12:
      status = "Very hot";
      break;
    default:
      status = "Unknown";
      break;
  }
  return status;
}

interface weatherItem {
  url?: string;
  lat: number;
  lon: number;
  duration: number;
}

const weather = async (param: weatherItem) => {
  const endpoint = param.url
    ? param.url
    : "https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at";
  const url = `${endpoint}?lat=${param.lat}&lon=${param.lon}&duration=${param.duration}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TMD_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });
    let msg = await response.json();
    return msg;
  } catch (error) {
    console.error("Error:", error);
  }
};

const Get_ms_stations = async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
      ` 
        SELECT capacity, latitude, longitude, station_code, station_name,station_address
        FROM ms_stations;
        `
    );
    result.rows.map((item, index) => {
      item.station_name_short = item.station_name.includes("รหัส")
        ? item.station_name.replace(/ รหัส \d+/g, "")
        : item.station_name;
    });
    return result.rows;
  } finally {
    client.release();
  }
};

const Get_weather = async (lat_long: any[]) => {
  try {
    if (lat_long) {
      for (const item of lat_long) {
        const param = {
          lat: item.latitude,
          lon: item.longitude,
          duration: 1,
        };
        const weather_data = await weather(param);
        if (
          weather_data &&
          weather_data.WeatherForecasts &&
          weather_data.WeatherForecasts.length > 0
        ) {
          const forecasts = weather_data.WeatherForecasts[0].forecasts;
          if (forecasts && forecasts.length > 0 && forecasts[0].data) {
            const data = forecasts[0].data;
            item.cond = EncodeWeatherCondition(Number(data.cond));
            item.cond_id = Number(data.cond);
            item.rh = data.rh;
            item.tc = data.tc;
          } else {
            item.cond = EncodeWeatherCondition(1);
            item.cond_id = 1;
            item.rh = 88.5;
            item.tc = 35.6;
            //console.error("Missing forecast data");
          }
        } else {
          item.cond = EncodeWeatherCondition(1);
          item.cond_id = 1;
          item.rh = 88.5;
          item.tc = 35.6;
          //console.error("Missing forecast data");
        }
      }
    }
    return lat_long || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const Get_inverter = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      ` 
        WITH RankedData AS (
          SELECT
              active_power AS realtime_pv,
              station_code,
              "timestamp",
              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY "timestamp" DESC) AS RowNum
          FROM
              inverter
      )
      SELECT
          realtime_pv,
          station_code,
          "timestamp"
      FROM
          RankedData
      WHERE
          RowNum = 1;
        `
    );
    return result.rows;
  } finally {
    client.release();
  }
};

const Get_energy = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      ` 
        WITH RankedData AS (
          SELECT
              ABS(active_power/1000) AS realtime_grid,
              station_code,
              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY "timestamp" DESC) AS RowNum
          FROM
              energy
      )
      SELECT
          realtime_grid,
          station_code
      FROM
          RankedData
      WHERE
          RowNum = 1;
        `
    );
    return result.rows;
  } finally {
    client.release();
  }
};
const Get_inv_energy = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      ` 
        WITH RankedData AS (
          SELECT
              ABS(active_power/1000) AS realtime_grid,
              station_code,
              ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY "timestamp" DESC) AS RowNum
              FROM
                  sensor_energy
          )
          SELECT
              realtime_grid,
              station_code
          FROM
              RankedData
          WHERE
              RowNum = 1;
        `
    );
    return result.rows;
  } finally {
    client.release();
  }
};
const Get_stations = async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
      `  
          SELECT day_power as yield_today,total_power as total_yield ,real_health_state as station_status ,station_code  
          FROM stations;
        `
    );
    result.rows.map((item, index) => {
      item.station_status = EncodeStationStatus(item.station_status);
    });
    return result.rows;
  } finally {
    client.release();
  }
};
const Get_stations_year = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `  
        SELECT SUM(reduction_total_co2) AS co2, station_code
        FROM stations_year
        GROUP BY station_code;        
        `
    );
    return result.rows;
  } finally {
    client.release();
  }
};
const Get_tou = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `  
        SELECT
          station_code,
          SUM(yield_total) AS energy,
          SUM(revenue) AS revenue
        FROM
          tou t 
        GROUP BY
          station_code;
        `
    );
    return result.rows;
  } finally {
    client.release();
  }
};
const Get_data = async () => {
  const inverter = await Get_inverter();
  const stations = await Get_stations();
  const stations_y = await Get_stations_year();
  const energy = await Get_energy();
  const inv_energy = await Get_inv_energy();
  const tou = await Get_tou();
  const ms_stations = await Get_ms_stations();
  const weather = await Get_weather(ms_stations);

  const mapArr2 = stations.reduce((acc, entry) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  const mapArr3 = stations_y.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );

  const mapArr4 = energy.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );

  const mapArr5 = inv_energy.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );

  const mapArr6 = tou.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );

  const mapArr7 = ms_stations.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );
  const mapArr8 = weather.reduce(
    (acc: { [x: string]: any }, entry: { station_code: string | number }) => {
      acc[entry.station_code] = entry;
      return acc;
    },
    {}
  );

  let combinedData = inverter.map((entry) => ({
    ...entry,
    ...mapArr2[entry.station_code],
    ...mapArr3[entry.station_code],
    ...mapArr4[entry.station_code],
    ...mapArr5[entry.station_code],
    ...mapArr6[entry.station_code],
    ...mapArr7[entry.station_code],
    ...mapArr8[entry.station_code],
  }));

  combinedData.map((item, index) => {
    if (item.realtime_grid && item.realtime_pv) {
      item.realtime_load = parseFloat(
        (item.realtime_grid + item.realtime_pv).toFixed(3)
      );
    } else {
      item.realtime_load = 0;
    }
  });
  return combinedData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const payload = await Get_data();
      res.status(200).json(payload);
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
