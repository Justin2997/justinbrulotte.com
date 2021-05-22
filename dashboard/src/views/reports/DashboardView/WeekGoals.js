import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  },
  list: {
    maxHeight: '450px',
    overflow: 'scroll'
  }
}));

function WeekGoals({ className, goals }) {
  const classes = useStyles();

  if (goals === null) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="Week Goals"
        />
        <Divider />
        <CircularProgress />
      </Card>
    );
  }

  console.log('goals', goals);

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        subtitle={`${goals.length} in total`}
        title={`Week Goals (${goals.length})`}
      />
      <Divider />
      <List className={classes.list}>
        {goals.map((goal, i) => (
          <ListItem
            divider={i < goal.length - 1}
            key={goal.id}
          >
            <ListItemAvatar>
              <img
                alt="weekGoals"
                className={classes.image}
                src="/static/images/goals.png"
              />
            </ListItemAvatar>
            <ListItemText
              primary={goal.name}
              secondary={`${goal.labelName.toUpperCase()}`}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

WeekGoals.propTypes = {
  className: PropTypes.string,
  goals: PropTypes.array
};

export default WeekGoals;
