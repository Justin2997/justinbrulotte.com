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
  useTheme
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const TaskReparticion = ({ className, labelLists }) => {
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

  function randomRgba() {
    const o = Math.round; const r = Math.random; const
      s = 255;
    return `rgba(${o(r() * s)},${o(r() * s)},${o(r() * s)}, 1)`;
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
  const backgroundColors = [];
  labelLists.sort(compare);
  for (index in labelLists) {
    numbers.push(labelLists[index].number);
    labels.push(labelLists[index].name);
    backgroundColors.push(randomRgba());
  }

  const data = {
    datasets: [
      {
        data: numbers,
        backgroundColor: backgroundColors,
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
      <CardHeader title="Tasks categorie of the past 2 months" />
      <Divider />
      <CardContent>
        <Box
          height={400}
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
  labelLists: PropTypes.array
};

export default TaskReparticion;
