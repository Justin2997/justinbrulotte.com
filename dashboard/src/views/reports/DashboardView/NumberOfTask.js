import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIconPositive: {
    color: colors.green
  },
  differenceValuePositive: {
    color: colors.green,
    marginRight: theme.spacing(1)
  },
  differenceIconNegative: {
    color: colors.red
  },
  differenceValueNegative: {
    color: colors.red,
    marginRight: theme.spacing(1)
  },
  differenceIconNeutre: {
    color: colors.yellow
  },
  differenceValueNeutre: {
    color: colors.yellow,
    marginRight: theme.spacing(1)
  }
}));

const NumberOfTask = ({
  className, todayTask, yesterdayTask, error
}) => {
  const classes = useStyles();

  function differenceCalculator() {
    const difference = todayTask.length - yesterdayTask.length;

    // Positive
    if (difference > 0) {
      return (
        <>
          <ArrowUpwardIcon className={classes.differenceIconPositive} />
          <Typography
            className={classes.differenceValuePositive}
            variant="body2"
          >
            {difference}
          </Typography>
        </>
      );
    }

    // Negative
    if (difference < 0) {
      return (
        <>
          <ArrowDownwardIcon className={classes.differenceIconNegative} />
          <Typography
            className={classes.differenceValueNegative}
            variant="body2"
          >
            {difference}
          </Typography>
        </>
      );
    }

    // Default
    return (
      <>
        <TrendingFlatIcon className={classes.differenceIconNeutre} />
        <Typography
          className={classes.differenceValueNeutre}
          variant="body2"
        >
          {difference}
        </Typography>
      </>
    );
  }

  if (todayTask === null || yesterdayTask === null) {
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
              TASK TODAY
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {error ? '—' : todayTask.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AssignmentTurnedInIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {error ? null : differenceCalculator()}
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {error ? 'Task data unavailable' : 'Since yesterday'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

NumberOfTask.propTypes = {
  className: PropTypes.string,
  todayTask: PropTypes.array,
  yesterdayTask: PropTypes.array,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default NumberOfTask;
