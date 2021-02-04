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

function LatestProducts({ className, todayTask }) {
  const classes = useStyles();

  if (todayTask === null) {
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardHeader
          title="Latest Products"
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
        title="Today Tasks"
      />
      <Divider />
      <List className={classes.list}>
        {todayTask.map((product, i) => (
          <ListItem
            divider={i < product.length - 1}
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
    </Card>
  );
}

LatestProducts.propTypes = {
  className: PropTypes.string,
  todayTask: PropTypes.array
};

export default LatestProducts;
