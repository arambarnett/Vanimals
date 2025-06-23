import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  sectionContentContainer: {
    display: "flex",
    overflowX: "auto",
    overflowY: "hidden",
  },
  innerSectionContentContainer: {
    display: "flex",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
}));

const HorizontalScroll = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Box className={classes.sectionContentContainer}>
      <Box
        className={classes.innerSectionContentContainer}
        {...rest}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HorizontalScroll;
