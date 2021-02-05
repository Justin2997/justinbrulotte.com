import React, { useEffect, useState } from 'react';
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
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import TodayIcon from '@material-ui/icons/Today';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
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

const TotalCustomers = ({ className, allTask }) => {
  const classes = useStyles();

  const [thisMonthTask, setThisMonthTask] = useState(null);
  const [lastMonthTask, setLastMonthTask] = useState(null);

  console.log('allTask', allTask);

  useEffect(() => {
    if (allTask) {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth((today.getMonth() - 1) % 12);

      const thisMonthList = allTask.filter((task) => {
        const date = new Date(task.due);
        return (today.getMonth() === date.getMonth());
      });

      const lastMonthList = allTask.filter((task) => {
        const date = new Date(task.due);
        return (lastMonth.getMonth() === date.getMonth());
      });

      setThisMonthTask(thisMonthList);
      setLastMonthTask(lastMonthList);
    }
  }, [allTask]);

  if (allTask === null || thisMonthTask === null || lastMonthTask === null) {
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

  function differenceCalculator() {
    const difference = thisMonthTask.length - lastMonthTask.length;

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
              NUMBER OF TASK THIS MONTH
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {thisMonthTask.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <TodayIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          {differenceCalculator()}
          <Typography
            color="textSecondary"
            variant="caption"
          >
            Since yesterday
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalCustomers.propTypes = {
  className: PropTypes.string,
  allTask: PropTypes.array
};

export default TotalCustomers;
