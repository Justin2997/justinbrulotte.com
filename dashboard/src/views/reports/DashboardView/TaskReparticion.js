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

const backgroundColorsPie = [
  'rgb(222, 197, 100)',
  'rgb(222, 216, 31)',
  'rgb(163, 143, 17)',
  'rgb(95, 69, 50)',
  'rgb(199, 123, 211)',
  'rgb(56, 136, 94)',
  'rgb(88, 158, 193)',
  'rgb(253, 180, 48)',
  'rgb(28, 63, 149)',
  'rgb(124, 231, 167)',
  'rgb(186, 10, 229)',
  'rgb(138, 49, 60)',
  'rgb(179, 142, 88)',
  'rgb(54, 59, 108)',
  'rgb(250, 101, 36)',
  'rgb(254, 217, 175)',
  'rgb(134, 24, 62)',
  'rgb(244, 194, 148)',
  'rgb(185, 191, 121)',
  'rgb(206, 226, 46)',
];

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
  labelLists.sort(compare);
  for (index in labelLists) {
    numbers.push(labelLists[index].number);
    labels.push(labelLists[index].name);
  }

  const data = {
    datasets: [
      {
        data: numbers,
        backgroundColor: backgroundColorsPie,
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
