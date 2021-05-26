import React from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  Divider,
  CircularProgress,
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';

import useWeather from 'src/utils/hooks/useWeather';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  },
  list: {
    maxHeight: '450px',
    overflow: 'scroll'
  }
}));

function WeekWeather({ city }) {
  const classes = useStyles();

  const [weekWeather] = useWeather(city);

  if (weekWeather === []) {
    return (
      <Card>
        <CardHeader
          title="Week Weather"
        />
        <Divider />
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        subtitle={`${weekWeather.length} in total`}
        title="Next 5 day weather"
      />
      <Divider />
      <List className={classes.list}>
        {weekWeather.map((timeWeather, i) => (
          <ListItem
            divider={i < timeWeather.length - 1}
            key={timeWeather.id}
          >
            <ListItemAvatar>
              <img
                alt={timeWeather.type}
                className={classes.image}
                src={timeWeather.icon}
              />
            </ListItemAvatar>
            <ListItemText
              primary={`${timeWeather.type.toUpperCase()} - ${timeWeather.temperature}°C`}
              secondary={`${timeWeather.date.toUpperCase()}`}
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
