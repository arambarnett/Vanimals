import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";
import {
  Box,
  Typography,
} from "@material-ui/core";
import BaseScreen from "components/BaseScreen";
import withMainLayout from "hocs/withMainLayout";
import HorizontalArragement from "components/HorizontalArragement";
import AllVanimals from "components/AllVanimals";
// import VanimalRatio from "components/SubComponents/VanimalRatio";
import bgVanimals from "assets/vanimals/bgVanimals.png";

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundImage: `url('${bgVanimals.src}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  // container: {
  //   boxSizing: "border-box",
  //   padding: "4rem",
  //   marginTop: theme.spacing(2),
  // },
  [theme.breakpoints.down("sm")]: {
    container: {
      padding: "4rem 1rem",
    },
  },
  cards: {
    display: "flex",
    marginTop: "40px",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-around",
  },
  // backTable: {
  //   background: theme.color.gradient,
  //   backgroundSize: "contain",
  //   borderRadius: "15px",
  // },
}));

const Vanimals = () => {
  const classes = useStyles();

  return (
    <Box className={classes.hero}>
      <BaseScreen title="Vanimals" subtitle="Season 1 Species">
        <HorizontalArragement>
          <Typography className="font-bold">
            Click one to learn about it
          </Typography>
        </HorizontalArragement>
        <Box mt={5} className={classes.cards}>
          <AllVanimals />
        </Box>
        {/* <Box className={clsx(classes.container, classes.backTable)}>
          <VanimalRatio />
        </Box> */}
        <Box height={120} />
      </BaseScreen>
    </Box>
  );
};

export default withMainLayout(Vanimals);
