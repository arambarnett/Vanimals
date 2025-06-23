import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import BaseScreen from "components/BaseScreen";
import withMainLayout from "hocs/withMainLayout";
import FillBackground from "components/FillBackground";
import bgVanimals from "assets/vanimals/bgVanimals.png";
import FriendsVanimals from "components/FriendsVanimals";
import { useRouter } from "next/router";

const useStyles = makeStyles(() => ({
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
  cards: {
    display: "flex",
    flexWrap: "nowrap",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
}));
const Collection = () => {
  const classes = useStyles();
  const router = useRouter();
  const { blockchainAddress } = router.query;
   
  return (
    <Box className={classes.hero}>
      <BaseScreen title="User Collection" subtitle="Vanimals">
        <FillBackground />
        <Box className={classes.cards}>
          <FriendsVanimals blockchainAddress={blockchainAddress} />
        </Box>
        <Box height={200} />
      </BaseScreen>
    </Box>
  );
};

export default withMainLayout(Collection);
