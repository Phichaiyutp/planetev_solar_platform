import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../db';

function EncodePlantStatus(code: number):string{
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
          SELECT day_power as yield_today,total_power as total_yield ,real_health_state as plant_status ,station_code  
          FROM public.stations;
        `);
        result.rows.map((item,index)=>{
          item.plant_status = EncodePlantStatus(item.plant_status)
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
        SELECT reduction_total_co2 as co2,station_code  
        FROM public.stations_year sy;
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
          site_id AS station_code,
          SUM(yield_total) AS energy,
          SUM(revenue) AS revenue
        FROM
            tou t 
        GROUP BY
            site_id;
        `);
    return result.rows;
  } finally {
    client.release();
  } 
})
const get_data = ( async () => {
  const inverter = await get_inverter();
  const stations = await get_stations(); 
  const _stations_y = await get_stations_year(); 
  const energy = await get_energy();
  const inv_energy = await get_inv_energy();
  const tou = await get_tou();
  

  const stations_y = _stations_y.reduce((acc, entry) => {
    const existingEntry = acc.find((item: { station_code: any; }) => item.station_code === entry.station_code);
    if (existingEntry) {
        existingEntry.co2 += entry.co2;
    } else {
        acc.push({ "co2": entry.co2, "station_code": entry.station_code });
    }
    return acc;
  }, []);


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

  let combinedData = inverter.map(entry => ({
    ...entry,
    ...mapArr2[entry.station_code],
    ...mapArr3[entry.station_code],
    ...mapArr4[entry.station_code],
    ...mapArr5[entry.station_code],
    ...mapArr6[entry.station_code],
  }));

  combinedData.map((item,index)=>{
    item.realtime_load = parseFloat((item.realtime_grid + item.realtime_pv).toFixed(3)) 
  })
  return combinedData;
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const payload = await get_data()
      res.status(200).json(payload);
    } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
