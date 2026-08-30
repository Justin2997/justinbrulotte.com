

import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

function formatWeatherData(data) {
  const weather = [];

  for (const key in data.list) {
    const object = data.list[key];

    weather.push({
      id: uuid(),
      date: object.dt_txt,
      temperature: object.main.temp,
      type: object.weather[0].description,
      icon: `https://openweathermap.org/img/w/${object.weather[0].icon}.png`
    });
  }
  return weather;
}

export default function useWeather(city) {
  const units = 'metric'; // To get in celcius
  const appid = import.meta.env.REACT_APP_OPEN_WHEATER_API;
  const weatherAPI = 'https://api.openweathermap.org/data/2.5/forecast';

  const [counter, setCounter] = useState(0);

  const [weekWeather, setWeekWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!appid) {
      setWeekWeather([]);
      setError(new Error('Weather data is not configured'));
      setLoading(false);
      return undefined;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const weatherReponse = await axios.get(weatherAPI, { params: { q: city, units, appid } });

        const weather = formatWeatherData(weatherReponse.data);
        setWeekWeather(weather);
      } catch (fetchError) {
        setWeekWeather([]);
        setError(fetchError);
        if (import.meta.env.PROD) {
          console.error('Weather fetch failed', fetchError);
        }
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(() => {
      setCounter((value) => value + 1);
    }, 100000);

    fetchData();
    return () => clearTimeout(timeout);
  }, [appid, city, counter]);

  return [weekWeather, loading, error];
}
