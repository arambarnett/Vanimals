/* eslint-disable max-len */
/* eslint-disable no-console */
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { useBlockchain } from "store/Blockchain";
import { useTranslation } from "i18n";
import {
  Box,
  Paper,
  Button,
  Typography,
  Fade,
  Modal,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import Degg from "assets/eggs/gold.gif";
import eggAnimation from "assets/landing/egg.gif";
import VerticalArragement from "components/VerticalArragement";
import HorizontalArragement from "components/HorizontalArragement";
import { Timer, CheckCircle, OfflineBolt } from "@material-ui/icons";
import { useResource } from "hooks";
import { Pagination } from "@material-ui/lab";
import APIEndpoints from "APIEndpoints";
import useHit from "hooks/useHit";
import SuccessBox from "components/OpenEgg/SuccessBox";
import ErrorBox from "components/OpenEgg/ErrorBox";
import SplashLoading from "./SplashLoading";
import HatchTimeRemaining from "./HatchTimeRemaining";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    padding: theme.spacing(2),
    marginTop: "20px",
    width: "300px",
    height: "450px",
  },
  pagination: {
    "& button": {
      color: theme.palette.primary.main,
    },
    "& li > div": {
      color: theme.palette.primary.main,
    },
  },
  button: {
    padding: theme.spacing(1),
    display: "grid",
    marginTop: theme.spacing(4),
  },
  boxes: {
    marginTop: theme.spacing(3),
  },
  eggs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
  timer: {
    display: "flex",
    padding: theme.spacing(1),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  ready: {
    display: "flex",
    color: "white",
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    backgroundColor: "#6d64eb",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "140px",
  },
  eggImg: {
    marginTop: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(9, 9, 7),
  },
}));

const HATCH_STATE = {
  UNSTARTED: 1,
  PROCESSING: 2,
  SIGNING: 3,
  COMPLETED: 4,
  FAILED: 5,
};

const EggsCollection = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { addressCKB, signTransaction } = useBlockchain();
  const hit = useHit();
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [openEggState, setOpenEggState] = useState(HATCH_STATE.UNSTARTED);
  const [openEggMessage, setOpenEggMessage] = useState("");

  const {
    data,
    mutate,
    loading,
  } = useResource(addressCKB && APIEndpoints.COLLECTION.GET(
    { offset: (page - 1) * itemsPerPage, limit: itemsPerPage, type: "EGG", blockchainAddress: addressCKB },
  ));

  if (loading || !addressCKB) { return <SplashLoading />; }
  const { data: items, totalCount } = data || {};

  const pagesLength = Math.ceil(totalCount / itemsPerPage);
  const handleClose = () => {
    setOpen(false);
  };

  const onOpenEgg = async (typeScript) => {
    setOpen(true);
    setOpenEggState(HATCH_STATE.PROCESSING);

    const response = await hit(APIEndpoints.COLLECTION.HATCHING, { blockchainAddress: addressCKB, typeScript });
    if (response.error) {
      setOpenEggState(HATCH_STATE.FAILED);
      setOpenEggMessage(response.error);
      console.error("hatching-egg error: ", response.error);
    } else {
      setOpenEggState(HATCH_STATE.SIGNING);

      try {
        const txHash = await signTransaction(response.transaction);
        hit(APIEndpoints.COLLECTION.HATCHING_OPEN, { txHash, hatchingId: response.id, transactionStatus: "success" });

        setOpenEggState(HATCH_STATE.COMPLETED);
        mutate(data);
      } catch (error) {
        setOpenEggState(HATCH_STATE.FAILED);
        setOpenEggMessage(error.message);
        console.error("open-egg-transaction error: ", error.message);
      }
    }
  };

  return (
    <>
      <HorizontalArragement className={classes.eggs}>
        {[...(items || [])].map((item, i) => (
          <HorizontalArragement padding="15px" key={i}>
            <Fade in style={{ transitionDelay: 700 * i }}>
              <Paper className={classes.summaryContainer}>
                <HorizontalArragement justifyContent="flex-start" spacing={1.5}>
                  <Typography variant="caption" className="font-bold" noWrap>
                    #
                    {" "}
                    {item.cellId}
                  </Typography>
                </HorizontalArragement>
                <VerticalArragement className={classes.boxes} justifyContent="center">
                  <Box>
                    <HorizontalArragement marginTop="20px" justifyContent="center" spacing={0.5}>
                      <Typography variant="caption" className="font-bold">
                        Gen
                        {" "}
                        {item.gen}
                      </Typography>
                      <Typography variant="caption" className="font-bold">
                        |
                      </Typography>
                      <Box className={item.readyToUnlock && !item.isHatching ? classes.ready : classes.timer}>
                        <Timer fontSize="small" />
                        {item.readyToUnlock && !item.isHatching && (
                          <Typography variant="caption" className="font-bold">
                            Ready to hatch
                          </Typography>
                        )}
                        {item.readyToUnlock === false ? (
                          <Typography variant="caption" className="font-bold">
                            Hatching
                          </Typography>
                        ) : null}
                        {item.isHatching
                          ? (
                            <Typography variant="caption" className="font-bold">
                              Hatching in process
                            </Typography>
                          ) : null}
                      </Box>
                    </HorizontalArragement>
                    {item.readyToUnlock && !item.isHatching && (
                      <HorizontalArragement marginTop="20px" color="green" justifyContent="center" spacing={0.5}>
                        <CheckCircle fontSize="small" />
                        <Typography className="font-bold">
                          Ready to hatch
                        </Typography>
                      </HorizontalArragement>
                    )}
                    {item.readyToUnlock === false
                      ? (
                        <HorizontalArragement marginTop="20px" color="red" justifyContent="center" spacing={0.5}>
                          <Timer fontSize="small" />
                          <Typography className="font-bold">
                            <HatchTimeRemaining unlockTimestamp={item.unlockTimestamp} onReadyToHatch={() => mutate(data)} />
                          &nbsp;minutes
                          </Typography>
                        </HorizontalArragement>
                      ) : null}
                    {item.isHatching && item.readyToUnlock
                      && (
                        <HorizontalArragement marginTop="20px" color="orange" justifyContent="center" spacing={0.5}>
                          <OfflineBolt fontSize="small" />
                          <Typography className="font-bold">
                            Wait a moment
                          </Typography>
                        </HorizontalArragement>
                      )}
                  </Box>
                  <Box className={classes.eggImg} height={170}>
                    {item.readyToUnlock === false
                      ? (
                        <img
                          alt="Asset not found"
                          src={Degg.src}
                          width="auto"
                          height={150}
                        />
                      )
                      : (
                        <img
                          alt="Asset not found"
                          src={eggAnimation.src}
                          width="auto"
                          height={170}
                        />
                      )}
                  </Box>
                </VerticalArragement>
                <Box className={classes.button}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onOpenEgg(item.typeScript)}
                    disabled={item.readyToUnlock === false || item.isHatching}
                  >
                    Open Egg
                  </Button>
                </Box>
              </Paper>
            </Fade>
          </HorizontalArragement>
        ))}

      </HorizontalArragement>
      <Box my={4}>
        <Pagination
          count={pagesLength}
          page={page}
          color="primary"
          className={classes.pagination}
          onChange={(e, val) => { setPage(val); }}
          hidePrevButton={false}
          shape="rounded"
        />
      </Box>

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
            {openEggState === HATCH_STATE.PROCESSING && (
              <Box display="flex" alignItems="center">
                <CircularProgress disableShrink size={50} />
                <Box ml={2}>
                  <Typography variant="body1">Opening egg...</Typography>
                </Box>
              </Box>
            )}
            {openEggState === HATCH_STATE.SIGNING && (
              <>
                <Box display="flex" alignItems="center">
                  <CircularProgress disableShrink size={50} />
                  <Box ml={2}>
                    <Typography variant="body1">
                      To complete the process please sign the transaction with Metamask.
                      <br />
                      If you already cancelled the transaction you can close this modal.
                    </Typography>
                    <Box textAlign="right" mt={1}>
                      <Button
                        variant="text"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            setOpenEggState(HATCH_STATE.UNSTARTED);
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
            {openEggState === HATCH_STATE.COMPLETED && (
              <SuccessBox />
            )}
            {openEggState === HATCH_STATE.FAILED && (
              <ErrorBox
                message={t(openEggMessage || "CANNOT_OPEN_EGG")}
                onTryAgain={() => {
                  setOpen(false);
                  setTimeout(() => {
                    setOpenEggState(HATCH_STATE.UNSTARTED);
                  }, 500);
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default EggsCollection;
