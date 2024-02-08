import { NextApiRequest, NextApiResponse } from 'next';
import pool from './pg';


interface OverallItem {
  energyOverall : number;
  revenueOverall : number;
  energyMonthly : number;
  revenueMonthly : number;
  energyTotalOffPeak : number;
  revenueTotalOffPeak : number;
  energyTotalOnPeak : number;
  revenueTotalOnPeak : number;
  realtimePV : number;
  yieldToday : number;
  consumtionToday : number;
  totalCO2 : number;
}

let mock_dashboardData : OverallItem = {
  energyOverall :  0,
  revenueOverall :  0,
  energyMonthly :  0,
  revenueMonthly :  0,
  energyTotalOffPeak :  0,
  revenueTotalOffPeak :  0,
  energyTotalOnPeak :  0,
  revenueTotalOnPeak :  0,
  realtimePV :  0,
  yieldToday :  0,
  consumtionToday :  0,
  totalCO2 : 0  
} 

const get_inverter = (async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
        ` 
        WITH RankedData AS (
          SELECT
            active_power,
            station_code,
            "timestamp",
            ROW_NUMBER() OVER (PARTITION BY station_code ORDER BY "timestamp" DESC) AS RowNum
          FROM
            inverter
        )
        SELECT
          SUM(active_power) AS realtime_pv
        FROM
          RankedData
        WHERE
          RowNum = 1
        GROUP BY
          "timestamp";
        `); 
    result.rows.forEach(row => {
      row['realtime_pv'] = parseFloat(row['realtime_pv'].toFixed(2));
    });
    return result.rows[0];
  } finally {
    client.release();
  }  
})
const get_stations = (async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
        `  
          SELECT SUM(day_power) as yield_today,SUM(total_power)/1000 as total_yield  
          FROM public.stations;
        `);
    result.rows[0].yield_today = parseFloat(result.rows[0].yield_today.toFixed(2))
    result.rows[0].total_yield = parseFloat(result.rows[0].total_yield.toFixed(2))
    return result.rows[0];
  } finally {
    client.release();
  }
})
const get_stations_year = (async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
        `  
        SELECT SUM(reduction_total_co2) as co2  
        FROM public.stations_year sy;
        `);
    result.rows[0].co2 = parseFloat(result.rows[0].co2.toFixed(2))
    return result.rows[0];
  } finally {
    client.release();
  } 
})
const get_tou = (async () => {
  const client = await pool.connect();
  try {
    let result = await client.query(
        `  
        SELECT
          SUM(yield_on_peak)AS total_on_peak,
          SUM(yield_off_peak) AS total_off_peak,
          SUM(yield_total) AS energy_overall
        FROM
          tou t 
        `);
    result.rows[0].total_on_peak = parseFloat(result.rows[0].total_on_peak.toFixed(2))
    result.rows[0].total_off_peak = parseFloat(result.rows[0].total_off_peak.toFixed(2))
    result.rows[0].energy_overall = parseFloat(result.rows[0].energy_overall.toFixed(2))
    return result.rows[0];
  } finally {
    client.release();
  } 
})
const get_config = (async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(
        `  
        SELECT value_name, value, data_type, "expression", group_name
        FROM config;
        `);
    return result.rows;
  } finally {
    client.release();
  } 
})
const get_billing = (yield_on_peak: number, yield_off_peak: number, config: any[]) => {
  function execution(config: any[], valueName: any) {
    const findConfig = config.find((item) => item.value_name === valueName);
    if (findConfig && findConfig.expression !== null) {
      const result = parseFloat((eval(findConfig.expression)).toFixed(2)) as number;
      return result;
    } else {
      const result = parseFloat(findConfig.value) as number;
      return result;
    }
  }

  const e_rate_on = execution(config, 'e_rate_on');
  const e_rate_off = execution(config, 'e_rate_off');
  const dsc = execution(config, 'dsc');
  const ead_on = execution(config, 'ead_on');
  const ead_off = execution(config, 'ead_off');
  const revenue_on = execution(config, 'revenue_on');
  const revenue_off = execution(config, 'revenue_off');
  const revenue_total = execution(config, 'revenue_total');

  return { revenue_total, revenue_on, revenue_off };
};

const get_data = ( async () => {
  const inverter = await get_inverter()
  const stations = await get_stations()
  const stations_y = await get_stations_year()
  const tou = await get_tou()
  const config = await get_config()
  const billing = get_billing(tou.total_on_peak,tou.total_off_peak, config)

  let combinedData = {
    ...inverter,
    ...stations,
    ...stations_y,
    ...tou,
    ...billing
  }
  return combinedData;
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const payload = await get_data();;
      //console.log(payload);
      res.status(200).json(payload);
    } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
