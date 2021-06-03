/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

function formatWeatherData(data) {
  const weather = [];

  for (const key in data.list) {
    const object = data.list[key];
    const currentDate = new Date(object.dt_txt);

    weather.push({
      id: uuid(),
      day_of_the_week: currentDate.getDay(),
      date: currentDate.toString(),
      temperature: object.main.temp,
      type: object.weather[0].description,
      icon: `http://openweathermap.org/img/w/${object.weather[0].icon}.png`
    });
  }
  return weather;
}

export default function useWeather(city) {
  const units = 'metric'; // To get in celcius
  const appid = process.env.REACT_APP_OPEN_WHEATER_API;
  const weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast';

  const [counter, setCounter] = useState(0);

  const [weekWeather, setWeekWeather] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const weatherReponse = await axios.get(weatherAPI, { params: { q: city, units, appid } });

        if (weatherReponse.status !== 200) {
          console.error(`Cannot get weather data error code ${weatherReponse.status}`);
        }

        const weather = formatWeatherData(weatherReponse.data);
        setWeekWeather(weather);
      } catch (error) {
        console.error(error);
      }
    }

    const timeout = setTimeout(() => {
      setCounter(counter + 1);
    }, 100000);

    fetchData();
    return () => clearTimeout(timeout);
  }, [counter]);

  return [weekWeather];
}
