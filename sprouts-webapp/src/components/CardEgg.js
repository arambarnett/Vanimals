import { Box, Button, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import Degg from "assets/eggs/DEGG.png";
import HorizontalArragement from "components/HorizontalArragement";
import VerticalArragement from "components/VerticalArragement";
import { Timer } from "@material-ui/icons";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useState } from "react";
import { useRouter } from "next/router";
import routes from "routes";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    padding: theme.spacing(2),
    width: "250px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  textPrice: {
    padding: theme.spacing(1),
    backgroundColor: "#C4DFFF",
    borderRadius: theme.shape.borderRadius,
  },
  // input: {
  //   padding: "10px",
  // },
  // inputBase: {
  //   textAlign: "center",
  //   margin: theme.spacing(1),
  // },
  buy: {
    display: "flex",
    justifyContent: "space-between",
    borderRadius: "18.5029px",
    height: "39,42px",
    width: "129,52px",
  },
  button: {
    padding: "8px",
    display: "grid",
  },
}));

const CardEgg = () => {
  const classes = useStyles();
  const [eggs] = useState(1);
  const router = useRouter();
  const onBuy = () => {
    router.push(routes.STORE_DETAIL.replace(":eggs", eggs));
  };

  return (
    <Grid>
      <VerticalArragement spacing={2}>
        <Paper className={classes.summaryContainer}>
          <HorizontalArragement justifyContent="flex-start" spacing={1.5}>
            <Typography variant="body1" className={classes.textPrice}>
              1000 CKB
            </Typography>
          </HorizontalArragement>
          <VerticalArragement justifyContent="center">
            <Box display="flex" justifyContent="center" width="100%" height={170}>
              <img
                alt="Asset not found"
                src={Degg.src}
                width="auto"
                height={150}
              />
            </Box>
            <Box>
              <HorizontalArragement justifyContent="center" spacing={0.5}>
                <Typography variant="body2">
                  Gen 0
                </Typography>
                <Typography variant="body2">
                  |
                </Typography>
                <Timer color="primary" fontSize="small" />
                <Typography variant="body2">
                  Hatching (1 Hour)
                </Typography>
              </HorizontalArragement>
            </Box>
            {/* <Box className={classes.input}>
              <TextField
                variant="outlined"
                value={eggs}
                size="small"
                InputProps={{
                  readOnly: true,
                  classes: {
                    input: classes.inputBase,
                  },
                  startAdornment: (
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => setEggs((e) => e - 1)}
                      disabled={!eggs}
                    >
                      <Remove />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => setEggs((e) => e + 1)}
                    >
                      <Add />
                    </IconButton>
                  ),
                }}
              />
            </Box> */}
          </VerticalArragement>
          <Box className={classes.button}>
            <Button
              className={classes.buy}
              variant="contained"
              color="primary"
              onClick={onBuy}
              disabled
              endIcon={
                <ArrowForwardIosIcon />
              }
            >
              <Typography>
                Buy
              </Typography>
            </Button>
          </Box>
        </Paper>
      </VerticalArragement>
    </Grid>
  );
};

export default CardEgg;
