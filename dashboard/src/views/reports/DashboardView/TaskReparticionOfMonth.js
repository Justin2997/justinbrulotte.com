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
  useTheme,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const TaskReparticionOfMonth = ({
  className, title, allTask, monthNumber
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

  function compileThisMonthTask() {
    let i;
    let e;
    const labelListsThisMonth = [];

    for (i in allTask) {
      const { labelName } = allTask[i];
      if (labelName !== undefined) {
        let newLabel = true;
        for (i in labelListsThisMonth) {
          if (labelName === labelListsThisMonth[i].name) {
            newLabel = false;
          }
        }
        if (newLabel) {
          labelListsThisMonth.push({ name: labelName, number: 0 });
        }
      }
    }

    // Task group by month and label
    const thisMonthTask = allTask.filter((task) => {
      const date = new Date(task.due);
      return (date.getMonth() === monthNumber && date.getFullYear() === new Date().getFullYear() - 1);
    });

    console.log(monthNumber, thisMonthTask);

    for (e in thisMonthTask) {
      let t;
      for (t in labelListsThisMonth) {
        if (allTask[e].labelName === labelListsThisMonth[t].name) {
          labelListsThisMonth[t].number += 1;
        }
      }
    }

    console.log(labelListsThisMonth);

    return labelListsThisMonth;
  }

  const labelLists = compileThisMonthTask();

  let index;
  const numbers = [];
  const labels = [];
  const colorsPie = [];
  labelLists.sort(compare);
  for (index in labelLists) {
    numbers.push(labelLists[index].number);
    labels.push(labelLists[index].name);
    colorsPie.push(stringToColour(labelLists[index].name));
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
      <CardHeader title={`Tasks categorie of month number ${title} (${monthNumber})`} />
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
      <Typography variant="h6" color="textSecondary">
        {' '}
        Number of task :
        {' '}
        {[].length}
      </Typography>
    </Card>
  );
};

TaskReparticionOfMonth.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  allTask: PropTypes.array,
  monthNumber: PropTypes.number,
};

export default TaskReparticionOfMonth;
