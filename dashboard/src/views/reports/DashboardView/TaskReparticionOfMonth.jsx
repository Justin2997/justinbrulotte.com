

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
  useTheme,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

function getMonthTasks(allTask, monthNumber, yearNumber) {
  const tasks = [];
  for (let i = 0; i < allTask.length; i += 1) {
    const { due, dateLastActivity } = allTask[i];
    const dateValue = dateLastActivity || due;
    const taskDate = dateValue ? new Date(dateValue) : null;
    const taskTime = taskDate ? taskDate.getTime() : NaN;
    if (taskDate
      && !Number.isNaN(taskTime)
      && taskDate.getMonth() === monthNumber
      && taskDate.getFullYear() === yearNumber) {
      tasks.push(allTask[i]);
    }
  }

  return tasks;
}

const TaskReparticionOfMonth = ({
  className, title, allTask, monthNumber, error
}) => {
  const classes = useStyles();
  const theme = useTheme();

  if (allTask === null) {
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

  const thisMonthTask = getMonthTasks(allTask, monthNumber, new Date().getFullYear());
  const labelCounter = {};

  for (let taskIndex = 0; taskIndex < thisMonthTask.length; taskIndex += 1) {
    const { labelName } = thisMonthTask[taskIndex];
    if (labelName) {
      labelCounter[labelName] = (labelCounter[labelName] || 0) + 1;
    }
  }

  const labelLists = [];
  const monthLabelNames = Object.keys(labelCounter);
  for (let labelIndex = 0; labelIndex < monthLabelNames.length; labelIndex += 1) {
    const name = monthLabelNames[labelIndex];
    const number = labelCounter[name];
    labelLists.push({ name, number });
  }

  const numbers = [];
  const labels = [];
  const colorsPie = [];
  for (let pieIndex = 0; pieIndex < labelLists.length; pieIndex += 1) {
    numbers.push(labelLists[pieIndex].number);
    labels.push(labelLists[pieIndex].name);
    colorsPie.push(stringToColour(labelLists[pieIndex].name));
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
    labels
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

  const totalTasks = thisMonthTask.length;
  const topThree = [...labelLists].sort(compare).slice(-3).reverse();

  if (topThree.length === 0) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader title={`Task categories — ${title}`} />
        <Divider />
        <CardContent>
          <Typography variant="h5" color="textSecondary">
            {error ? 'Monthly categories are unavailable right now.' : 'No completed tasks this month.'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader title={`Task categories — ${title}`} />
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
        <Typography variant="h4" color="textSecondary">
          Top 3 categories
        </Typography>
        <Divider />
        {topThree.map((category) => {
          const denominator = Math.max(totalTasks, 1);
          return (
            <Typography
              key={category.name}
              variant="h5"
              color="textSecondary"
            >
              {`${category.name.toUpperCase()} - ${category.number} - ${(category.number / denominator * 100).toFixed(2)}%`}
            </Typography>
          );
        })}
        <Divider />
        <Typography variant="h5" color="textSecondary">
          {' '}
          Number of tasks:
          {' '}
          {thisMonthTask.length}
        </Typography>
      </CardContent>
    </Card>
  );
};

TaskReparticionOfMonth.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  allTask: PropTypes.array,
  monthNumber: PropTypes.number,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default TaskReparticionOfMonth;
