import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  container: ({ spacing }) => ({
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginLeft: theme.spacing(spacing),
    },
    "& > :first-child": {
      marginLeft: 0,
    },
  }),
}));

const HorizontalArragement = ({ children, spacing = 1, ...rest }) => {
  const classes = useStyles({ spacing });
  return (
    <Box className={classes.container} {...rest}>
      {children}
    </Box>
  );
};

export default HorizontalArragement;
