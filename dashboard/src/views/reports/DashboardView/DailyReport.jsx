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
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
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
    fontWeight: 700,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(1)
    }
  },
  liveChip: {
    backgroundColor: colors.green[50],
    color: colors.green[800]
  },
  loadingChip: {
    backgroundColor: colors.indigo[50],
    color: colors.indigo[800]
  },
  unavailableChip: {
    backgroundColor: colors.orange[50],
    color: colors.orange[900]
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
    const value = task.dateLastActivity || task.due;
    if (!value) {
      return false;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
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
  stravaError,
  stravaLoading,
  error
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
  const unavailable = Boolean(error);
  let statusLabel = 'Live data';
  let statusClass = classes.liveChip;
  let weeklyCategoryMessage = 'No weekly task categories yet.';
  let sportValue = '…';
  let sportCaption = 'Strava activities';
  if (loading) {
    statusLabel = 'Loading data';
    statusClass = classes.loadingChip;
  } else if (unavailable) {
    statusLabel = 'Data unavailable';
    statusClass = classes.unavailableChip;
    weeklyCategoryMessage = 'Weekly categories are unavailable right now.';
  } else if (weeklyCategories.length > 0) {
    weeklyCategoryMessage = null;
  }
  if (!stravaLoading && stravaActivities) {
    sportValue = stravaError ? '—' : stravaActivities.length;
    if (stravaError) {
      sportCaption = 'Sports data unavailable';
    }
  }

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
            aria-label={`Dashboard status: ${statusLabel}`}
            className={clsx(classes.updatedChip, statusClass)}
            label={statusLabel}
            size="small"
          />
        </Box>
        {unavailable && (
          <Typography
            className={classes.muted}
            role="status"
            variant="body2"
          >
            Trello data could not be loaded. Values are unavailable until the next refresh.
          </Typography>
        )}
        {loading ? (
          <CircularProgress aria-label="Loading dashboard data" />
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
                  {unavailable ? '—' : todayTask.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {unavailable ? 'Data unavailable' : `${taskDelta >= 0 ? `+${taskDelta}` : taskDelta} vs yesterday`}
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
                  {unavailable ? '—' : thisMonthTasks.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {unavailable ? 'Data unavailable' : `${monthDelta >= 0 ? `+${monthDelta}` : monthDelta} vs last month`}
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
                  {unavailable ? '—' : weekGoals.length}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {unavailable ? 'Data unavailable' : 'Top priorities loaded'}
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
                  {sportValue}
                </Typography>
                <Typography
                  className={classes.statCaption}
                  variant="body2"
                >
                  {sportCaption}
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
                {weeklyCategoryMessage ? (
                  <Typography
                    className={classes.statCaption}
                    variant="body2"
                  >
                    {weeklyCategoryMessage}
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
  stravaError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  stravaLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default DailyReport;
