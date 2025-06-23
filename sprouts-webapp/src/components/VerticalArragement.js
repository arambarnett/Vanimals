import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  container: ({ spacing }) => ({
    "& > *": {
      marginTop: theme.spacing(1 * spacing),
    },
    "& > :first-child": {
      marginTop: 0,
    },
  }),
}));

const VerticalArragement = ({ children, spacing = 1, className, ...rest }) => {
  const classes = useStyles({ spacing });
  return (
    <Box className={clsx(classes.container, className)} {...rest}>
      {children}
    </Box>
  );
};

export default VerticalArragement;
