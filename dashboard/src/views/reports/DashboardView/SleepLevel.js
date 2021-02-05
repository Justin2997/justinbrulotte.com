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
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

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

  console.log('fitbitData', fitbitData);

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
              TASKS PROGRESS
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              75.5%
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            value={75.5}
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
