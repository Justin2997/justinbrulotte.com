/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Typography,
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

function SportOfTheMonth({
  className, stravaActivities, loading, error
}) {
  const classes = useStyles();

  if (stravaActivities === null || loading) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="Sports this month"
        />
        <Divider />
        <CardContent>
          <CircularProgress aria-label="Loading sports activities" size={24} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title={`This month sports (${stravaActivities.length})`}
      />
      <Divider />
      {error || stravaActivities.length === 0 ? (
        <CardContent>
          <Typography color="textSecondary" variant="body2">
            {error ? 'Sports data is unavailable right now.' : 'No activities recorded this month.'}
          </Typography>
        </CardContent>
      ) : (
        <List className={classes.list}>
          {stravaActivities.map((activity, i) => (
            <ListItem
              divider={i < stravaActivities.length - 1}
              key={activity.url || `${activity.name}-${activity.date}`}
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
                secondary={`${activity.date} - ${activity.string_time}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}

SportOfTheMonth.propTypes = {
  className: PropTypes.string,
  stravaActivities: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default SportOfTheMonth;
