import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

const useStylesFacebook = makeStyles((theme) => ({
  root: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    height: 60,
    width: 60,
    alignItems: "center",
    borderRadius: "50%",
  },
  bottom: {
    position: "absolute",
    color: theme.palette.grey[400],
  },
  top: {
    animationDuration: "550ms",
    position: "absolute",
    zIndex: 1,
  },
  circle: {
    strokeLinecap: "round",
  },
}));

const LabeledCircularProgress = ({ children, containerClassName, className, ...rest }) => {
  const classes = useStylesFacebook();

  return (
    <Box className={clsx(classes.root, containerClassName)}>
      <CircularProgress
        variant="determinate"
        className={clsx(classes.bottom, className)}
        size={40}
        thickness={2}
        {...rest}
        color="inherit"
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...rest}
      />
      {children}
    </Box>
  );
};

export default LabeledCircularProgress;
