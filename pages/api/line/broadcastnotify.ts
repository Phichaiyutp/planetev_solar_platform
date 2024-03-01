import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/db/pg';

function EncodeStationStatus(code: number):string{
  let status:string
  switch (code) {
    case 1:
      status = 'Offline'
      break;
    case 2:
      status = 'Faulty'
      break;
    case 3:
      status = 'Online'
      break;
    default:
      status = 'Unknown'
      break;
  }
  return status;
}

function EncodeWeatherCondition(code: number):string{
  let status:string
  switch (code) {
    case 1:
      status = 'Clear'
      break;
    case 2:
      status = 'Partly cloudy'
      break;
    case 3:
      status = 'Cloudy'
      break;
    case 4:
      status = 'Overcast'
      break;
    case 5:
      status = 'Light rain'
      break;
    case 6:
      status = 'Moderate rain'
      break;
    case 7:
      status = 'Heavy rain'
      break;
    case 8:
      status = 'Thunderstorm'
      break;
    case 9:
      status = 'Very cold'
      break;
    case 10:
      status = 'Cold'
      break;
    case 11:
      status = 'Cool'
      break;
    case 12:
      status = 'Very hot'
      break;
    default:
      status = 'Unknown'
      break;
  }
  return status;
}

interface weatherItem {
  url?:string;
  lat:number;
  lon:number;
  duration:number;
}

const weather = async (param: weatherItem) => {
  const endpoint = param.url ? param.url : 'https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at';
  const url = `${endpoint}?lat=${param.lat}&lon=${param.lon}&duration=${param.duration}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TMD_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 60 }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};


const get_lat_long = (async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
        ` 
        SELECT latitude, longitude, station_code
        FROM ms_stations;
        `);    
    return result.rows;
  } finally {
    client.release();
  }  
})

const get_weather: () => Promise<any[]> = async () => {
  try {
    let lat_long = await get_lat_long();
    if (lat_long) {
      for (const item of lat_long) {
        const param = {
          lat: item.latitude,
          lon: item.longitude,
          duration: 1
        };
        const weather_data = await weather(param);
        if (weather_data.WeatherForecasts[0].forecasts[0].data) {
          item.cond = EncodeWeatherCondition(Number(weather_data.WeatherForecasts[0].forecasts[0].data.cond));
          item.cond_id = Number(weather_data.WeatherForecasts[0].forecasts[0].data.cond);
          item.rh = weather_data.WeatherForecasts[0].forecasts[0].data.rh;
          item.tc = weather_data.WeatherForecasts[0].forecasts[0].data.tc;
        }
      }
    }
    return lat_long || []; 
  } catch (error) {
    console.error(error);
    return []; 
  }
};



const get_inverter = (async () => {
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
        `);    
    return result.rows;
  } finally {
    client.release();
  }  
}) 

const get_energy = (async () => {
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
        `);
    return result.rows;
  } finally {
    client.release();
  } 
}) 
const get_inv_energy = (async () => {
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
        `);
    return result.rows;
  } finally {
    client.release();
  } 
}) 
const get_stations = (async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
        `  
          SELECT day_power as yield_today,total_power as total_yield ,real_health_state as station_status ,station_code,station_name,station_address  
          FROM public.stations;
        `);
        result.rows.map((item,index)=>{
          item.station_status = EncodeStationStatus(item.station_status)
          item.station_name_short = item.station_name.includes('รหัส') ? item.station_name.replace(/ รหัส \d+/g, '') : item.station_name;
        })
    return result.rows;
  } finally {
    client.release();
  }
}) 
const get_stations_year = (async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
        `  
        SELECT SUM(reduction_total_co2) AS co2, station_code
        FROM public.stations_year
        GROUP BY station_code;        
        `);
    return result.rows;
  } finally {
    client.release();
  } 
})
const get_tou = (async () => {
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
        `);
    return result.rows;
  } finally {
    client.release();
  } 
})
const get_data = ( async () => {
  const inverter = await get_inverter();
  const stations = await get_stations(); 
  const stations_y = await get_stations_year(); 
  const energy = await get_energy();
  const inv_energy = await get_inv_energy();
  const tou = await get_tou();
  const weather = await get_weather();

  const mapArr2 = stations.reduce((acc, entry) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});
  
  const mapArr3 = stations_y.reduce((acc: { [x: string]: any; }, entry: { station_code: string | number; }) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  const mapArr4 = energy.reduce((acc: { [x: string]: any; }, entry: { station_code: string | number; }) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  const mapArr5 = inv_energy.reduce((acc: { [x: string]: any; }, entry: { station_code: string | number; }) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  const mapArr6 = tou.reduce((acc: { [x: string]: any; }, entry: { station_code: string | number; }) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  const mapArr7 = weather.reduce((acc: { [x: string]: any; }, entry: { station_code: string | number; }) => {
    acc[entry.station_code] = entry;
    return acc;
  }, {});

  let combinedData = inverter.map(entry => ({
    ...entry,
    ...mapArr2[entry.station_code],
    ...mapArr3[entry.station_code],
    ...mapArr4[entry.station_code],
    ...mapArr5[entry.station_code],
    ...mapArr6[entry.station_code],
    ...mapArr7[entry.station_code],
  }));

  combinedData.map((item,index)=>{
    item.realtime_load = parseFloat((item.realtime_grid + item.realtime_pv).toFixed(3)) 
  })
  return combinedData;
})


      


const SendMessage = async (lineToken: string, message: string) => {
    try {
        const response = await fetch('https://notify-api.line.me/api/notify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${lineToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                message: message
            }).toString()
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const station_data = await get_data();

            const result = await pool.query('SELECT username, line_token FROM users');
            const users = result.rows;

            if (!users.length) throw new Error('No users found');

            const responses = [];
            for (const user of users) {
                const { username, line_token: lineToken } = user;
                for (const station of station_data) {
                    const message = JSON.stringify({
                        station_status: station.station_status,
                        station_name: station.station_name,
                        realtime_pv: station.realtime_pv,
                        yield_today: station.yield_today,
                    });
                    const response = await SendMessage(lineToken, message);
                    responses.push({ username, response });
                }
            }
            res.status(200).json(responses); 
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
