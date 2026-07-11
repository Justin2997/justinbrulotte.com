import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3)
  },
  eyebrow: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  title: {
    marginTop: theme.spacing(0.5)
  },
  updatedChip: {
    fontWeight: 700
  },
  statBlock: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    height: '100%',
    padding: theme.spacing(2)
  },
  statLabel: {
    color: theme.palette.text.secondary,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: 'uppercase'
  },
  statValue: {
    marginTop: theme.spacing(1)
  },
  statCaption: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5)
  },
  insight: {
    borderLeft: `3px solid ${colors.indigo[500]}`,
    paddingLeft: theme.spacing(2)
  },
  categoryRow: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1)
  },
  categoryName: {
    fontWeight: 700,
    marginRight: theme.spacing(2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  muted: {
    color: theme.palette.text.secondary
  }
}));

function getMonthTasks(allTask, monthOffset) {
  if (!allTask) {
    return [];
  }

  const target = new Date();
  target.setMonth(target.getMonth() + monthOffset);

  return allTask.filter((task) => {
    if (!task.due) {
      return false;
    }
    const date = new Date(task.due);
    return date.getMonth() === target.getMonth() && date.getFullYear() === target.getFullYear();
  });
}

function sortCategories(labelLists) {
  if (!labelLists) {
    return [];
  }

  return [...labelLists]
    .filter((label) => label.number > 0)
    .sort((a, b) => b.number - a.number)
    .slice(0, 3);
}

function DailyReport({
  className,
  todayTask,
  yesterdayTask,
  allTask,
  labelListsOfWeek,
  weekGoals,
  stravaActivities,
  stravaLoading
}) {
  const classes = useStyles();

  const loading = todayTask === null
    || yesterdayTask === null
    || allTask === null
    || weekGoals === null
    || labelListsOfWeek === null;
  const thisMonthTasks = getMonthTasks(allTask, 0);
  const lastMonthTasks = getMonthTasks(allTask, -1);
  const weeklyCategories = sortCategories(labelListsOfWeek);
  const taskDelta = todayTask && yesterdayTask ? todayTask.length - yesterdayTask.length : 0;
  const monthDelta = thisMonthTasks.length - lastMonthTasks.length;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        <Box className={classes.header}>
          <Box>
            <Typography className={classes.eyebrow}>
              Personal operations report
            </Typography>
            <Typography
              className={classes.title}
              color="textPrimary"
              variant="h2"
            >
              Dashboard overview
            </Typography>
            <Typography
              className={classes.muted}
              variant="body2"
            >
              Tasks, focus time, goals, and activity in one scan.
            </Typography>
          </Box>
          <Chip
            className={classes.updatedChip}
            color="primary"
            label="Live data"
            size="small"
          />
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
            >
              <Box className={classes.statBlock}>
                <Typography className={classes.statLabel}>
                  Completed today
                </Typography>
                <Typography
                  className={classes.statValue}
                  color="textPrimary"
                  variant="h3"
                >
                  {todayTask.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {taskDelta >= 0 ? `+${taskDelta}` : taskDelta}
                  {' '}
                  vs yesterday
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
            >
              <Box className={classes.statBlock}>
                <Typography className={classes.statLabel}>
                  This month
                </Typography>
                <Typography
                  className={classes.statValue}
                  color="textPrimary"
                  variant="h3"
                >
                  {thisMonthTasks.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {monthDelta >= 0 ? `+${monthDelta}` : monthDelta}
                  {' '}
                  vs last month
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
            >
              <Box className={classes.statBlock}>
                <Typography className={classes.statLabel}>
                  Week goals
                </Typography>
                <Typography
                  className={classes.statValue}
                  color="textPrimary"
                  variant="h3"
                >
                  {weekGoals.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  Top priorities loaded
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
            >
              <Box className={classes.statBlock}>
                <Typography className={classes.statLabel}>
                  Sports this month
                </Typography>
                <Typography
                  className={classes.statValue}
                  color="textPrimary"
                  variant="h3"
                >
                  {stravaLoading || !stravaActivities ? '…' : stravaActivities.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  Strava activities
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <Box className={classes.insight}>
                <Typography
                  color="textPrimary"
                  variant="h5"
                >
                  Top categories this week
                </Typography>
                {weeklyCategories.length === 0 ? (
                  <Typography
                    className={classes.statCaption}
                    variant="body2"
                  >
                    No weekly task categories yet.
                  </Typography>
                ) : (
                  weeklyCategories.map((category) => (
                    <Box
                      className={classes.categoryRow}
                      key={category.name}
                    >
                      <Typography
                        className={classes.categoryName}
                        variant="body2"
                      >
                        {category.name || 'Unlabeled'}
                      </Typography>
                      <Chip
                        label={category.number}
                        size="small"
                      />
                    </Box>
                  ))
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
      <Divider />
    </Card>
  );
}

DailyReport.propTypes = {
  className: PropTypes.string,
  todayTask: PropTypes.array,
  yesterdayTask: PropTypes.array,
  allTask: PropTypes.array,
  labelListsOfWeek: PropTypes.array,
  weekGoals: PropTypes.array,
  stravaActivities: PropTypes.array,
  stravaLoading: PropTypes.bool
};

export default DailyReport;
