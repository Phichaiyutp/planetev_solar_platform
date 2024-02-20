import React from 'react';
import { WiSolarEclipse,
    WiDaySunnyOvercast,
    WiDayCloudy,
    WiNightCloudy,
    WiDayShowers,
    WiDayRainWind,
    WiDaySleetStorm,
    WiThunderstorm,
    WiSnowflakeCold,
    WiHot,
 } from "react-icons/wi";

function  WeatherIcon ({code}:{code:number}) {
  switch (code) {
    case 1:
      return <WiSolarEclipse color='#e39246' size={35} />;
    case 2:
      return <WiDaySunnyOvercast color='#e39246' size={35} />;
    case 3:
      return <WiDayCloudy color='#e39246' size={35} />;
    case 4:
      return <WiNightCloudy color='#e39246' size={35} />;
    case 5:
        return  <WiDayShowers color='#e39246' size={35} />;
    case 6:
        return  <WiDayRainWind color='#e39246' size={35} />;
    case 7:
      return <WiDaySleetStorm color='#e39246' size={35} />;
    case 8:
      return <WiThunderstorm color='#e39246' size={35} />;
    case 9:
    case 10:
    case 11:
        return <WiSnowflakeCold color='#e39246' size={35} />;
    case 12:
      return <WiHot color='#e39246' size={35} />;
    default:
      return null;
  }
}

export default WeatherIcon;