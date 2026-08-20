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
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

function getTaskDate(task) {
  const value = task.dateLastActivity || task.due;
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const TaskWeekDistribution = ({ className, allTask, error }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [thisWeekTask, setThisWeekTask] = useState(null);
  const [lastWeekTask, setLastWeekTask] = useState(null);

  useEffect(() => {
    if (allTask) {
      const today = moment();

      const thisWeekListByDay = [0, 0, 0, 0, 0, 0, 0];
      const lastWeekListByDay = [0, 0, 0, 0, 0, 0, 0];
      const lastWeekReference = moment().subtract(1, 'week');
      const currentWeekNumber = today.isoWeek();
      const currentWeekYear = today.isoWeekYear();
      const lastWeekNumber = lastWeekReference.isoWeek();
      const lastWeekYear = lastWeekReference.isoWeekYear();

      for (let taskIndex = 0; taskIndex < allTask.length; taskIndex += 1) {
        const date = getTaskDate(allTask[taskIndex]);
        if (date) {
          const momentDate = moment(date);
          const taskWeek = momentDate.isoWeek();
          const taskWeekYear = momentDate.isoWeekYear();
          const taskDay = momentDate.day();
          const dayIndex = taskDay === 0 ? 0 : taskDay;

          if (taskWeek === currentWeekNumber && taskWeekYear === currentWeekYear) {
            thisWeekListByDay[dayIndex] += 1;
          }
          if (taskWeek === lastWeekNumber && taskWeekYear === lastWeekYear) {
            lastWeekListByDay[dayIndex] += 1;
          }
        }
      }

      setThisWeekTask(thisWeekListByDay);
      setLastWeekTask(lastWeekListByDay);
    }
  }, [allTask]);

  if (allTask === null || !thisWeekTask || !lastWeekTask) {
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

  const hasActivity = thisWeekTask.some((value) => value > 0)
    || lastWeekTask.some((value) => value > 0);

  if (allTask.length === 0 || !hasActivity) {
    return (
      <Card className={clsx(classes.root, className)}>
        <CardHeader title="Task progression in the week" />
        <Divider />
        <CardContent>
          <Typography color="textSecondary" variant="body2">
            {error ? 'Task progression is unavailable right now.' : 'No task activity recorded for this or last week.'}
          </Typography>
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
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
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
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default TaskWeekDistribution;
