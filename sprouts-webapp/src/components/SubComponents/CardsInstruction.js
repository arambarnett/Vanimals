import { Box, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import HorizontalArragement from "components/HorizontalArragement";
import VerticalArragement from "components/VerticalArragement";
import { Opacity, Cached, Timer } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    padding: theme.spacing(2),
    marginTop: "20px",
    width: "350px",
    height: "200px",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
}));

const CardsInstruction = () => {
  const classes = useStyles();

  return (
    <Grid className={classes.grid}>
      <HorizontalArragement margin="15px" spacing={2}>
        <Paper className={classes.summaryContainer}>
          <Box>
            <HorizontalArragement justifyContent="flex-start" spacing={1.5}>
              <Timer color="primary" fontSize="small" />
              <Typography variant="caption" className="font-bold">
                Temperature
              </Typography>
            </HorizontalArragement>
            <VerticalArragement justifyContent="center">
              <Box>
                <Typography>
                  La temperatura debe ser de 37.5° (no menor a 36.5 o mayor a 38.5)
                  Evitar cambios bruscos de temperatura.
                  {" "}
                  <br />
                  Intervenir lo justo y necesario.
                  {" "}
                  <br />
                  Controlar los huevos los dias 2, 4.
                </Typography>
              </Box>
            </VerticalArragement>
          </Box>
        </Paper>
      </HorizontalArragement>
      <HorizontalArragement margin="15px" spacing={2}>
        <Paper className={classes.summaryContainer}>
          <Box>
            <HorizontalArragement justifyContent="flex-start" spacing={1.5}>
              <Opacity color="primary" fontSize="small" />
              <Typography variant="caption" className="font-bold">
                Humidity
              </Typography>
            </HorizontalArragement>
            <VerticalArragement justifyContent="center">
              <Box>
                <Typography>
                  La humedad, de 50 -60% durante la mayor parte del proceso.
                  {" "}
                  <br />
                  Llevandose 60 -70% los ultimos dos o tres dias para que la cascara
                  sea menos dura durante el nacimiento
                </Typography>
              </Box>
            </VerticalArragement>
          </Box>
        </Paper>
      </HorizontalArragement>
      <HorizontalArragement margin="15px" spacing={2}>
        <Paper className={classes.summaryContainer}>
          <Box>
            <HorizontalArragement justifyContent="flex-start" spacing={1.5}>
              <Cached color="primary" fontSize="small" />
              <Typography variant="caption" className="font-bold">
                Flip
              </Typography>
            </HorizontalArragement>
            <VerticalArragement justifyContent="center">
              <Box>
                <Typography>
                  El volteo, un minimo de 3 veces al dia para
                  que el embrion no se adhiera a la cascara.
                  {" "}
                  <br />
                  Los ultimos dos o tres dias este debe interrumpirse
                </Typography>
              </Box>
            </VerticalArragement>
          </Box>
        </Paper>
      </HorizontalArragement>
    </Grid>
  );
};

export default CardsInstruction;
