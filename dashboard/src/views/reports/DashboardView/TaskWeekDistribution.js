/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors,
  CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const TaskWeekDistribution = ({ className, allTask }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [thisWeekTask, setThisWeekTask] = useState(null);
  const [lastWeekTask, setLastWeekTask] = useState(null);

  useEffect(() => {
    if (allTask) {
      const today = moment();

      const thisWeekList = allTask.filter((task) => {
        const date = moment(task.due);
        return (date.isoWeek() === today.isoWeek());
      });

      const lastWeekList = allTask.filter((task) => {
        const date = moment(task.due);
        return (date.isoWeek() === today.isoWeek() - 1);
      });

      let index;
      const thisWeekListByDay = [0, 0, 0, 0, 0, 0, 0];
      const lastWeekListByDay = [0, 0, 0, 0, 0, 0, 0];

      for (index in thisWeekList) {
        const task = thisWeekList[index];
        const date = moment(task.due);
        thisWeekListByDay[date.day()] = thisWeekListByDay[date.day()] + 1;
      }

      for (index in lastWeekList) {
        const task = lastWeekList[index];
        const date = moment(task.due);
        lastWeekListByDay[date.day()] = lastWeekListByDay[date.day()] + 1;
      }

      setThisWeekTask(thisWeekListByDay);
      setLastWeekTask(lastWeekListByDay);
    }
  }, [allTask]);

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

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: thisWeekTask,
        label: 'This week'
      },
      {
        backgroundColor: colors.grey[200],
        data: lastWeekTask,
        label: 'Last week'
      }
    ],
    labels: ['Saturday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Task Progression in the week"
      />
      <Divider />
      <CardContent>
        <Box
          height={400}
          position="relative"
        >
          <Bar
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

TaskWeekDistribution.propTypes = {
  className: PropTypes.string,
  allTask: PropTypes.array,
};

export default TaskWeekDistribution;
