/* eslint-disable max-len */
/* eslint-disable no-console */
import { Box, Button, Divider, Grid, makeStyles, Paper, Typography, Modal, Fade, Backdrop, CircularProgress, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useBlockchain } from "store/Blockchain";
import { useTranslation } from "i18n";
import withMainLayout from "hocs/withMainLayout";
import BaseScreen from "components/BaseScreen";
import Degg from "assets/eggs/DEGG.png";
import HorizontalArragement from "components/HorizontalArragement";
import { FormatAlignCenter, Timer, ArrowBack } from "@material-ui/icons";
import VerticalArragement from "components/VerticalArragement";
import { useState } from "react";
import APIEndpoints from "APIEndpoints";
import useHit from "hooks/useHit";
import SuccessBox from "components/Payments/SuccessBox";
import ErrorBox from "components/Payments/ErrorBox";

const useStyles = makeStyles((theme) => ({
  hero: {
    background: "radial-gradient(90.55% 135.82% at 77.04% 110.14%, #EABEF8 1%, rgba(234, 190, 248, 0.93) 7%, rgba(234, 190, 248, 0.44) 53%, rgba(234, 190, 248, 0.12) 85%, rgba(234, 190, 248, 0) 100%);",
  },
  summaryContainer: {
    padding: theme.spacing(2),
    boxShadow: "0px 20px 27px rgba(0, 0, 0, 0.05)",
    marginTop: "8px",
  },
  buyEggHeader: {
    padding: theme.spacing(2),
  },
  box: {
    marginTop: "17px",
    backgroundColor: "white",
    width: "100%",
  },
  boxButton: {
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    width: "80%",
  },
  ckbLink: {
    textDecoration: "underline",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(9, 9, 7),
  },
}));

const FEE = 0.0001;
const EGG_PRICE = 1000;

const BUY_STATE = {
  UNSTARTED: 1,
  PROCESSING: 2,
  SIGNING: 3,
  COMPLETED: 4,
  FAILED: 5,
};

const StoreDetail = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const router = useRouter();
  const hit = useHit();

  const { egg } = router.query;
  const { addressCKB, balance, signTransaction } = useBlockchain();
  
  const [open, setOpen] = useState(false);
  const [buyingState, setBuyingState] = useState(BUY_STATE.UNSTARTED);
  const [buyingMessage, setBuyingMessage] = useState("");

  const onBackClick = () => {
    router.back();
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const onBuy = async () => {
    setOpen(true);
    setBuyingState(BUY_STATE.PROCESSING);

    const response = await hit(APIEndpoints.STORE.PAYMENT.CKB_TRANSACTION, { blockchainAddress: addressCKB });
    if (response.error) {
      setBuyingState(BUY_STATE.FAILED);
      setBuyingMessage(response.error);
      console.error("ckb-transaction error: ", response.error);
    } else {
      setBuyingState(BUY_STATE.SIGNING);
        
      try {
        const txHash = await signTransaction(response.transaction);
        hit(APIEndpoints.STORE.PAYMENT.CKB_TRANSACTION_HASH, { txHash, purchaseId: response.id, transactionStatus: "success" });

        setBuyingState(BUY_STATE.COMPLETED);
      } catch (error) {
        setBuyingState(BUY_STATE.FAILED);
        setBuyingMessage(error.message);
        console.error("sign-transaction error: ", error.error);
      }
    }
  };

  return (
    <div>
      <Button onClick={onBackClick}>
        <IconButton size="small">
          <ArrowBack />
        </IconButton>
        <Typography>
          Back
        </Typography>
      </Button>
      <BaseScreen title="Buy an egg">
        <Button startIcon={<ArrowBack />} onClick={onBackClick}>
          <Typography>
            Back
          </Typography>
        </Button>
        <Box display="flex" justifyContent="center" width="100%" className={classes.hero}>
          <img
            alt="Asset not found"
            src={Degg.src}
            width="auto"
            height={250}
          />
        </Box>
        <Box className={classes.box}>
          <Grid container spacing={8} justifyContent="space-around">
            <Grid item xs={12} md={5}>
              <VerticalArragement spacing={2} className={classes.buyEggHeader}>
                <Typography variant="h6" className="font-bold">
                  Buy your egg and discover the breed
                </Typography>
                <HorizontalArragement spacing={1.5}>
                  <Typography variant="caption" className="font-bold">
                    Gen 0
                  </Typography>
                  <Typography variant="caption" className="font-bold">
                    |
                  </Typography>
                  <HorizontalArragement spacing={0.5}>
                    <Timer color="primary" fontSize="small" />
                    <Typography variant="caption" className="font-bold">
                      Hatching (1 Hour)
                    </Typography>
                  </HorizontalArragement>
                </HorizontalArragement>
                <VerticalArragement>
                  <HorizontalArragement spacing={0.5}>
                    <Timer color="primary" fontSize="small" />
                    <Typography variant="caption" color="primary">
                      Hatching (1 Hour)
                    </Typography>
                  </HorizontalArragement>
                  <Typography variant="caption" className="font-bold">
                    Hatching time can be shortened or extended
                    depending on how you care for your egg
                  </Typography>
                </VerticalArragement>
              </VerticalArragement>
            </Grid>
            <Grid item xs={12} md={5}>
              <VerticalArragement spacing={2}>
                <Paper className={classes.summaryContainer}>
                  <HorizontalArragement justifyContent="space-between">
                    <Typography variant="body2">
                      Eggs
                    </Typography>
                    <HorizontalArragement>
                      <FormatAlignCenter fontSize="small" />
                      <Typography variant="body2">
                        {egg}
                        {" "}
                        EGG
                      </Typography>
                    </HorizontalArragement>
                  </HorizontalArragement>

                  <Divider variant="middle" />

                  <HorizontalArragement justifyContent="space-between">
                    <Typography variant="body2">
                      Estimated
                    </Typography>
                    <HorizontalArragement>
                      <FormatAlignCenter fontSize="small" />
                      <Typography variant="body2">
                        {(EGG_PRICE * egg).toFixed(4)}
                        {" "}
                        CKB
                      </Typography>
                    </HorizontalArragement>
                  </HorizontalArragement>

                  <Divider variant="middle" />
              
                  <HorizontalArragement justifyContent="space-between">
                    <Typography variant="body2">
                      Estimated transaction fee
                    </Typography>
                    <HorizontalArragement>
                      <FormatAlignCenter fontSize="small" />
                      <Typography variant="body2">
                        {(FEE * egg).toFixed(4)}
                        {" "}
                        CKB
                      </Typography>
                    </HorizontalArragement>
                  </HorizontalArragement>
              
                  <Divider variant="middle" />

                  <HorizontalArragement justifyContent="space-between">
                    <Typography className="font-bold" variant="body2" color="primary">
                      Estimated total
                    </Typography>
                    <HorizontalArragement>
                      <FormatAlignCenter fontSize="small" color="primary" />
                      <Typography className="font-bold" variant="body2" color="primary">
                        {((EGG_PRICE * egg) + (FEE * egg)).toFixed(4)}
                        {" "}
                        CKB
                      </Typography>
                    </HorizontalArragement>
                  </HorizontalArragement>
                </Paper>
                <Box textAlign="center" padding={1}>
                  {parseFloat(balance) < parseFloat(((EGG_PRICE * egg) + (FEE * egg))) ? (
                    <Typography variant="caption" className="font-bold" style={{ color: "#f44336" }}>
                      {t("NOT_ENOUGHT_BALANCE")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" className="font-bold">
                      This is our best estimation. By clicking the button below you will be
                      prompted
                      with the final transactions costs.
                    </Typography>
                  )}
                </Box>
                <Box className={classes.boxButton}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={parseFloat(balance) < parseFloat(((EGG_PRICE * egg) + (FEE * egg)))}
                    onClick={onBuy}
                  >
                    Buy
                  </Button>
                </Box>
                <Box textAlign="center" mt={2}>
                  <a href="https://www.nervos.org/token" target="_blank" rel="noreferrer" className={classes.ckbLink}>Get more information about CKB</a>
                </Box>
              </VerticalArragement>
            </Grid>
          </Grid>
        </Box>
        
        <Box height={200} />

        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          disableEscapeKeyDown
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className={classes.paper}>
              {buyingState === BUY_STATE.PROCESSING && (
                <Box display="flex" alignItems="center">
                  <CircularProgress disableShrink size={50} />
                  <Box ml={2}>
                    <Typography variant="body1">Processing transaction...</Typography>
                  </Box>
                </Box>
              )}
              {buyingState === BUY_STATE.SIGNING && (
                <>
                  <Box display="flex" alignItems="center">
                    <CircularProgress disableShrink size={50} />
                    <Box ml={2}>
                      <Typography variant="body1">
                        To complete the payment please sign the transaction with Metamask.
                        <br />
                        If you already cancelled the transaction you can close this modal.
                      </Typography>
                      <Box textAlign="right" mt={1}>
                        <Button
                          variant="text"
                          onClick={() => {
                            setOpen(false);
                            setTimeout(() => {
                              setBuyingState(BUY_STATE.UNSTARTED);
                            }, 500);
                          }}
                        >
                          Close
                        </Button>
                      </Box>
                    </Box>
                    
                  </Box>
                </>
              )}
              {buyingState === BUY_STATE.COMPLETED && (
                <SuccessBox />
              )}
              {buyingState === BUY_STATE.FAILED && (
                <ErrorBox
                  message={t(buyingMessage || "CANNOT_PROCESS_TRANSACTION")}
                  onTryAgain={() => {
                    setOpen(false);
                    setTimeout(() => {
                      setBuyingState(BUY_STATE.UNSTARTED);
                    }, 500);
                  }}
                />
              )}
            </Box>
          </Fade>
        </Modal>
      </BaseScreen>
    </div>
  );
};

export default withMainLayout(StoreDetail);
