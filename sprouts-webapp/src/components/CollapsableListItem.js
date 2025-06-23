import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    top: 0,
    left: 0,
  },
  container: {
    position: "relative",
  },
}));

const CollapsableListItem = ({ subListChildren, subListProps, children, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box className={classes.container}>
      <Fade in={open}>
        <Box className={classes.background} />
      </Fade>
      <ListItem button onClick={handleClick} {...rest}>
        {children}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested} disablePadding {...subListProps}>
          {subListChildren}
        </List>
      </Collapse>
    </Box>
  );
};

export default CollapsableListItem;
