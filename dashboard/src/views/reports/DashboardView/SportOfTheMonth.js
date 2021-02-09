/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  makeStyles
} from '@material-ui/core';

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

function SportOfTheMonth({ className, stravaActivities, loading }) {
  const classes = useStyles();

  console.log(stravaActivities);

  if (stravaActivities === null || loading) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="Latest Products"
        />
        <Divider />
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title={`This month sports ${stravaActivities.length}`}
      />
      <Divider />
      <List className={classes.list}>
        {stravaActivities.map((activity, i) => (
          <ListItem
            divider={i < activity.length - 1}
            key={i}
          >
            <ListItemAvatar>
              <a href={activity.url} target="_blank">
                <img
                  alt="Strava"
                  className={classes.image}
                  src="/static/images/strava.png"
                />
              </a>
            </ListItemAvatar>
            <ListItemText
              primary={activity.name}
              secondary={`${activity.date}`}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

SportOfTheMonth.propTypes = {
  className: PropTypes.string,
  stravaActivities: PropTypes.array,
  loading: PropTypes.bool,
};

export default SportOfTheMonth;
