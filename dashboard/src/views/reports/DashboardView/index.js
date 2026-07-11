/* eslint-disable max-len */
import React from 'react';
import {
  Container,
  Grid,
  makeStyles
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

const Dashboard = () => {
  const classes = useStyles();

  const [todayTask, yesterdayTask, allTask, labelLists, weekGoals, labelListsOfWeek] = useTrelloTasks();
  const [stravaActivities, stravaLoading] = useAllStravaActivity();

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
              stravaLoading={stravaLoading}
              todayTask={todayTask}
              weekGoals={weekGoals}
              yesterdayTask={yesterdayTask}
            />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <NumberOfTask todayTask={todayTask} yesterdayTask={yesterdayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            sm={6}
            xl={4}
            xs={12}
          >
            <NumberOfTaskByMonth allTask={allTask} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <WeekGoals goals={weekGoals} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TodayTasks todayTask={todayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <YeasterdayTasks todayTask={yesterdayTask} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TaskReparticion labelLists={labelLists} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TaskReparticionOfWeek labelLists={labelListsOfWeek} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <SportOfTheMonth stravaActivities={stravaActivities} loading={stravaLoading} />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={6}
            xs={12}
          >
            <WeekWeather city="Sherbrooke" />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <TaskWeekDistribution allTask={allTask} />
          </Grid>
          {
            ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((title, index) => (
              <Grid
                item
                lg={3}
                md={4}
                xl={4}
                xs={12}
              >
                <TaskReparticionOfMonth title={title} allTask={allTask} monthNumber={index} />
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
