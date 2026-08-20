/* eslint-disable max-len */
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';

import useTrelloTasks from 'src/utils/hooks/useTrelloTasks';
import useAllStravaActivity from 'src/utils/hooks/useAllStravaActivity';

import Page from 'src/components/Page';
import NumberOfTask from './NumberOfTask';
import TodayTasks from './TodayTasks';
import NumberOfTaskByMonth from './NumberOfTaskByMonth';
import TaskReparticion from './TaskReparticion';
import TaskReparticionOfWeek from './TaskReparticionOfWeek';
import TaskWeekDistribution from './TaskWeekDistribution';
import TaskReparticionOfMonth from './TaskReparticionOfMonth';
import SportOfTheMonth from './SportOfTheMonth';
import YeasterdayTasks from './YeasterdayTasks';
import WeekGoals from './WeekGoals';
import WeekWeather from './WeekWeather';
import DailyReport from './DailyReport';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function activeMonthsForCurrentYear(tasks) {
  if (!Array.isArray(tasks)) {
    return [];
  }

  const currentYear = new Date().getFullYear();
  const activeMonths = new Set();

  tasks.forEach((task) => {
    const dateValue = task.dateLastActivity || task.due;
    const date = dateValue ? new Date(dateValue) : null;

    if (date && !Number.isNaN(date.getTime()) && date.getFullYear() === currentYear) {
      activeMonths.add(date.getMonth());
    }
  });

  return [...activeMonths].sort((first, second) => first - second);
}

const Dashboard = () => {
  const classes = useStyles();

  const [todayTask, yesterdayTask, allTask, labelLists, weekGoals, labelListsOfWeek, error] = useTrelloTasks();
  const [stravaActivities, stravaLoading, stravaError] = useAllStravaActivity();
  const activeMonths = activeMonthsForCurrentYear(allTask);

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <DailyReport
              allTask={allTask}
              labelListsOfWeek={labelListsOfWeek}
              stravaActivities={stravaActivities}
              stravaError={stravaError}
              stravaLoading={stravaLoading}
              todayTask={todayTask}
              weekGoals={weekGoals}
              yesterdayTask={yesterdayTask}
              error={error}
            />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <NumberOfTask error={error} todayTask={todayTask} yesterdayTask={yesterdayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <NumberOfTaskByMonth allTask={allTask} error={error} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <WeekGoals error={error} goals={weekGoals} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TodayTasks error={error} todayTask={todayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <YeasterdayTasks error={error} todayTask={yesterdayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TaskReparticion error={error} labelLists={labelLists} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TaskReparticionOfWeek error={error} labelLists={labelListsOfWeek} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <SportOfTheMonth error={stravaError} loading={stravaLoading} stravaActivities={stravaActivities} />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={6}
            xs={12}
          >
            <WeekWeather city="Rimouski" />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <TaskWeekDistribution allTask={allTask} error={error} />
          </Grid>
          {allTask !== null && activeMonths.length === 0 && (
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <Card>
                <CardHeader title="Monthly category detail" />
                <Divider />
                <CardContent>
                  <Typography color="textSecondary" variant="body2">
                    {error
                      ? 'Monthly categories are unavailable right now.'
                      : `No completed tasks recorded in ${new Date().getFullYear()}.`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {activeMonths.map((index) => (
            <Grid
              key={monthNames[index]}
              item
              lg={3}
              md={4}
              xl={4}
              xs={12}
            >
              <TaskReparticionOfMonth
                allTask={allTask}
                error={error}
                monthNumber={index}
                title={monthNames[index]}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
