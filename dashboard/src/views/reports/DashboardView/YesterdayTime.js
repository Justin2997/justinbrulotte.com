/* eslint-disable radix */
/* eslint-disable max-len */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
  colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const YesterdayTime = ({ className, rescueTimeData, loading }) => {
  const classes = useStyles();

  function parseTime(time) {
    let pourcentage = time.split('h');
    if (pourcentage.length === 2) {
      pourcentage = [pourcentage[0], pourcentage[1].replace('m', '')];
      pourcentage = [parseInt(pourcentage[0]), parseInt(pourcentage[1])];
    }
    const productiveTime = new Date(0, 0, 0, pourcentage[0], pourcentage[1], 0);
    return productiveTime.getHours() * 60 + productiveTime.getMinutes();
  }

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

  const lastComputerTime = rescueTimeData[0].data[rescueTimeData[0].data.length - 1];
  const productivePourcentage = (parseTime(lastComputerTime.productive_time) / parseTime(lastComputerTime.total)).toFixed(2);
  const sofwarePourcentage = (parseTime(lastComputerTime.sofware_time) / parseTime(lastComputerTime.total)).toFixed(2);
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
              COMPUTER TIME
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {lastComputerTime.total}
            </Typography>
            <Typography
              color="textPrimary"
              variant="caption"
            >
              {`Productive time ${lastComputerTime.productive_time} (${productivePourcentage} %)`}
            </Typography>
            <br />
            <Typography
              color="textPrimary"
              variant="caption"
            >
              {`Sofware time ${lastComputerTime.sofware_time} (${sofwarePourcentage} %)`}
            </Typography>
          </Grid>
          <Grid item>
            <a href="https://blog.rescuetime.com/work-life-balance-study-2019/?utm_source=onboarding&utm_medium=site&utm_campaign=signup_personalization">
              <Avatar className={classes.avatar}>
                <AttachMoneyIcon />
              </Avatar>
            </a>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

YesterdayTime.propTypes = {
  className: PropTypes.string,
  rescueTimeData: PropTypes.array,
  loading: PropTypes.bool,
};

export default YesterdayTime;
