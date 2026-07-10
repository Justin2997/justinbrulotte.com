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
  Typography,
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
    maxHeight: 360,
    overflowY: 'auto'
  },
  empty: {
    padding: 24,
    textAlign: 'center'
  }
}));

function TodayTasks({ className, todayTask }) {
  const classes = useStyles();

  if (todayTask === null) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="Today Products"
        />
        <Divider />
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardHeader
        subtitle={`${todayTask.length} in total`}
        title={`Today Tasks (${todayTask.length})`}
      />
      <Divider />
      {todayTask.length === 0 ? (
        <Typography
          className={classes.empty}
          color="textSecondary"
          variant="body2"
        >
          No completed tasks today.
        </Typography>
      ) : (
        <List className={classes.list}>
          {todayTask.map((product, i) => (
            <ListItem
              divider={i < todayTask.length - 1}
              key={product.id}
            >
              <ListItemAvatar>
                <img
                  alt="Product"
                  className={classes.image}
                  src="/static/images/trello_logo.png"
                />
              </ListItemAvatar>
              <ListItemText
                primary={product.name}
                secondary={`${product.labelName.toUpperCase()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}

TodayTasks.propTypes = {
  className: PropTypes.string,
  todayTask: PropTypes.array
};

export default TodayTasks;
