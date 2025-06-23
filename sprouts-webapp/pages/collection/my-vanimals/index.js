/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-one-expression-per-line */
import { makeStyles } from "@material-ui/core/styles";
// import Link from "next/link";
import {
  Box,
  Typography,
//  Button
} from "@material-ui/core";
import BaseScreen from "components/BaseScreen";
import withMainLayout from "hocs/withMainLayout";
import FillBackground from "components/FillBackground";
import bgVanimals from "assets/vanimals/bgVanimals.png";
// import VanimalsCollection from "components/VanimalCollection";
// import { copyToClipboard } from "utils";
// import { useBlockchain } from "store/Blockchain";
// import { useState } from "react";

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
  // const [copy, setCopy] = useState(false);
  // const { addressCKB } = useBlockchain();

  // const onCopyLink = () => {
  //   setCopy(true);
  //   copyToClipboard(`${window.location.host}/collection/my-vanimals/${addressCKB}`);
  // };

  return (
    <Box className={classes.hero}>
      <BaseScreen title="My Collection" subtitle="Vanimals">
        <FillBackground />
        <Box display="flex" justifyContent="center">
          <Typography variant="h2" className={classes.comingSoon}>Coming soon stay tuned...</Typography>
        </Box>
        {/* <Button
          onClick={onCopyLink}
          className="font-bold"
          variant="contained"
          color="primary"
        >
          {copy ? "Link copied!" : "Share my collection"}
        </Button>
        <Box className={classes.cards}>
          <VanimalsCollection />
        </Box>
        <Box display="flex" justifyContent="center">
          <Link href="/store">
            <a>If you do not have vanimals go to Store</a>
          </Link>
        </Box> */}
        <Box height={200} />
      </BaseScreen>
    </Box>
  );
};

export default withMainLayout(Collection);
