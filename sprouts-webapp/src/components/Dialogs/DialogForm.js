import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 99,
  },
  title: {
    marginRight: 30,
    paddingBottom: theme.spacing(0),
  },
  subtitle: {
    paddingTop: 0,
  },
  bgClose: {
    color: theme.color.white,
    background: "#0000007a",
    borderRadius: "50%",
    width: 35,
    height: 35,
    padding: 5,
  },
}));

const Dialogs = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  children,
  contentClasses,
  bgClose = false,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (

    <Dialog
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      onClose={onClose}
      open={open}
      {...rest}
    >
      {onClose && cross && (
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close className={bgClose ? classes.bgClose : ""} />
        </IconButton>
      )}
      {title && <DialogTitle className={classes.title}>{title}</DialogTitle>}
      {subtitle && (
        <DialogTitle className={classes.subtitle}>
          <Typography color="textPrimary">{subtitle}</Typography>
        </DialogTitle>
      )}
      <DialogContent classes={contentClasses}>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default Dialogs;
