/* eslint-disable jsx-a11y/anchor-is-valid */
// import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import BaseScreen from "components/BaseScreen";
import withMainLayout from "hocs/withMainLayout";
import FillBackground from "components/FillBackground";
import bgVanimals from "assets/vanimals/bgVanimals.png";
// import EggsCollection from "components/EggsCollection";

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
  // cards: {
  //   display: "flex",
  //   flexWrap: "nowrap",
  //   flexDirection: "column",
  //   alignContent: "center",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  comingSoon: {
    color: theme.palette.primary.main,
    textTransform: "uppercase",
  },
}));
const Collection = () => {
  const classes = useStyles();
  
  return (
    <Box className={classes.hero}>
      <BaseScreen title="My Collection" subtitle="Eggs">
        <FillBackground />
        <Box display="flex" justifyContent="center">
          <Typography variant="h2" className={classes.comingSoon}>Coming soon stay tuned...</Typography>
        </Box>

        {/* <Box className={classes.cards}>
          <EggsCollection />
        </Box>
        <Box display="flex" justifyContent="center">
          <Link href="/store">
            <a>If you do not have eggs go to Store</a>
          </Link>
        </Box> */}
        <Box height={200} />
      </BaseScreen>
    </Box>
  );
};

export default withMainLayout(Collection);
