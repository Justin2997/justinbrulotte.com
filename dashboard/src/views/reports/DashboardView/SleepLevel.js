/* eslint-disable max-len */
/* eslint-disable radix */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
  CircularProgress,
  colors
} from '@material-ui/core';
import LocalHotelIcon from '@material-ui/icons/LocalHotel';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const SleepLevel = ({ className, fitbitData, loading }) => {
  const classes = useStyles();
  const shouldSleepFor = 7.5 * 3600;

  if (loading) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <Grid
            container
            justify="space-between"
            spacing={3}
          >
            <CircularProgress />
          </Grid>
        </CardContent>
      </Card>
    );
  }

  const todaySleep = fitbitData[0].data[fitbitData[0].data.length - 1];
  let progress = ((((parseInt(todaySleep.Leger) + parseInt(todaySleep.Autre)) / shouldSleepFor) * 100));
  if (progress > 100) {
    progress = 100;
  }
  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              SLEEP GOAL
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {todaySleep['Leger Time'] }
              {' Léger / '}
              {todaySleep['Autre Time'] }
              {' Profond'}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <LocalHotelIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            value={progress}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

SleepLevel.propTypes = {
  className: PropTypes.string,
  fitbitData: PropTypes.array,
  loading: PropTypes.any
};

export default SleepLevel;
