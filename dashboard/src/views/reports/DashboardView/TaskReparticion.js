/* eslint-disable no-bitwise */
/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  colors,
  makeStyles,
  CircularProgress,
  Typography,
  useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const TaskReparticion = ({ className, labelLists, error }) => {
  const classes = useStyles();
  const theme = useTheme();

  if (labelLists === null) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (labelLists.length === 0) {
    return (
      <Card className={clsx(classes.root, className)}>
        <CardHeader title="Task categories — past 30 days" />
        <Divider />
        <CardContent>
          <Typography color="textSecondary" variant="body2">
            {error ? 'Categories are unavailable right now.' : 'No task categories in the past 30 days.'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  function stringToColour(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      colour += (`00${value.toString(16)}`).substr(-2);
    }
    return colour;
  }

  function compare(a, b) {
    if (a.number < b.number) {
      return -1;
    }
    if (a.number > b.number) {
      return 1;
    }
    return 0;
  }

  let index;
  const numbers = [];
  const labels = [];
  const colorsPie = [];
  const sortedLabelLists = [...labelLists].sort(compare);
  for (index in sortedLabelLists) {
    numbers.push(sortedLabelLists[index].number);
    labels.push(sortedLabelLists[index].name);
    colorsPie.push(stringToColour(sortedLabelLists[index].name));
  }

  const data = {
    datasets: [
      {
        data: numbers,
        backgroundColor: colorsPie,
        borderWidth: 4,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: labels
  };

  const options = {
    animation: false,
    cutoutPercentage: 0,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: true,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 8,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: true,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Task categories — past 30 days" />
      <Divider />
      <CardContent>
        <Box
          height={280}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

TaskReparticion.propTypes = {
  className: PropTypes.string,
  labelLists: PropTypes.array,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default TaskReparticion;
