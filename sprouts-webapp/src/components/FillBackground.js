import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import withMainLayout from "hocs/withMainLayout";

const useStyles = makeStyles((theme) => ({
  background: {
    background: theme.color.gradient,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
}));

const Landing = () => {
  const classes = useStyles();
  return (
    <Box className={classes.background} />
  );
};

export default withMainLayout(Landing);
