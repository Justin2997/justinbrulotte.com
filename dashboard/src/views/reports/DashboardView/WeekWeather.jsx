import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography
} from '@material-ui/core';

import useWeather from 'src/utils/hooks/useWeather';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  image: {
    height: 36,
    width: 36
  },
  list: {
    paddingBottom: 0,
    paddingTop: 0
  }
}));

function summarizeForecast(weather) {
  const forecastsByDay = new Map();

  weather.forEach((forecast) => {
    const day = forecast.date.slice(0, 10);
    const hour = Number(forecast.date.slice(11, 13));
    const candidate = forecastsByDay.get(day);

    if (!candidate || Math.abs(hour - 12) < Math.abs(candidate.hour - 12)) {
      forecastsByDay.set(day, { ...forecast, hour });
    }
  });

  return [...forecastsByDay.values()].slice(0, 5);
}

function formatForecastDay(dateValue) {
  const date = new Date(dateValue.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) {
    return dateValue.slice(0, 10);
  }

  return new Intl.DateTimeFormat('en-CA', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  }).format(date);
}

function WeekWeather({ city }) {
  const classes = useStyles();
  const [weekWeather, loading, error] = useWeather(city);
  const dailyForecast = summarizeForecast(weekWeather);

  if (loading) {
    return (
      <Card className={classes.root}>
        <CardHeader title="Five-day forecast" />
        <Divider />
        <CardContent>
          <CircularProgress aria-label="Loading weather forecast" size={24} />
        </CardContent>
      </Card>
    );
  }

  if (error || dailyForecast.length === 0) {
    return (
      <Card className={classes.root}>
        <CardHeader title="Five-day forecast" />
        <Divider />
        <CardContent>
          <Typography color="textSecondary" role="status" variant="body2">
            {error ? 'Weather data is unavailable right now.' : 'No forecast data is available.'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        subtitle="One representative update per day"
        title="Five-day forecast"
      />
      <Divider />
      <List className={classes.list}>
        {dailyForecast.map((timeWeather, index) => (
          <ListItem
            divider={index < dailyForecast.length - 1}
            key={timeWeather.date}
          >
            <ListItemAvatar>
              <img
                alt={timeWeather.type}
                className={classes.image}
                src={timeWeather.icon}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${timeWeather.temperature}°C · ${timeWeather.type}`}
              secondary={formatForecastDay(timeWeather.date)}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

WeekWeather.propTypes = {
  city: PropTypes.string
};

export default WeekWeather;
