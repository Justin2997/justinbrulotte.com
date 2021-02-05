import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import useGoogleSheets from 'use-google-sheets';

import useTrelloTasks from 'src/utils/hooks/useTrelloTasks';

import Page from 'src/components/Page';
import NumberOfTask from './NumberOfTask';
import LatestOrders from './LatestOrders';
import TodayTasks from './TodayTasks';
import Sales from './Sales';
import SleepLevel from './SleepLevel';
import NumberOfTaskByMonth from './NumberOfTaskByMonth';
import TotalProfit from './TotalProfit';
import TrafficByDevice from './TrafficByDevice';

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

  const [todayTask, yesterdayTask, allTask] = useTrelloTasks();

  const { data: fitbitData, loading: fitbitLoading, error: fitbitError } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_FITBIT_GOOGLE_SHEETS_ID,
    sheetsNames: ['Feuille 1'],
  });
  if (fitbitError) { console.error(fitbitError); } // TODO: Add error to the user

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
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <NumberOfTask todayTask={todayTask} yesterdayTask={yesterdayTask} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <NumberOfTaskByMonth allTask={allTask} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <SleepLevel fitbitData={fitbitData} loading={fitbitLoading} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit />
          </Grid>
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <TrafficByDevice />
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
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
