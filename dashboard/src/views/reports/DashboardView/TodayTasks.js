import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import useTrelloTasks from 'src/utils/hooks/useTrelloTasks';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

function LatestProducts({ className, ...rest }) {
  const classes = useStyles();

  const [task] = useTrelloTasks();

  if (task === null) {
    return (
      <Card
        className={clsx(classes.root, className)}
        {...rest}
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
      {...rest}
    >
      <CardHeader
        subtitle={`${task.length} in total`}
        title="Today Tasks"
      />
      <Divider />
      <List>
        {task.map((product, i) => (
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
            <IconButton
              edge="end"
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="flex-end"
        p={2}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
