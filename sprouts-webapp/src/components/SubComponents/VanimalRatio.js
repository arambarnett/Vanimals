import { Box,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    marginTop: theme.spacing(1),
    width: "100%",
    borderRadius: "1rem",
  },
  text: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: theme.spacing(2),
    padding: theme.spacing(1),
    flexDirection: "column",
  },
  table: {
    height: "100%",
    background: "white",
    borderRadius: "10px",
  },
  titleTable: {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  paper: {
    overflowY: "hidden",
    boxShadow: "2px 20px 27px rgba(0, 0, 0, 0.15)",
  },
}));

const createData = (name, bengalTiger, chimpanzee, penguin, elephant, pigueon, axolotl) => ({
  name,
  bengalTiger,
  chimpanzee,
  penguin,
  elephant,
  pigueon,
  axolotl,
});

const rows = [
  createData("Hatching Probability", "37.55%", "3.39%", "11.55%", "21.26%", "20.90%", "5.35%"),
  createData("Common", "30.14%", "16.73%", "29.55%", "27.6%", "28.65%", "38.03%"),
  createData("Uncommon", "26.21%", "9.29%", "26.36%", "28.66%", "27.60%", "31.34%"),
  createData("Rare", " 22.28%", "22.30%", "23.72%", "21.23%", "23.44%", "12.67%"),
  createData("Super Rare", "15.73%", "16.73%", "13.58%", "15.93%", "13.03%", "7.88%"),
  createData("Ultra Rare", "3.02%", "18.22%", "3.59%", " 3.82%", "4.42%", "6.23%"),
  createData("Secret Rare", "2.62%", "16.73%", "2.96%", "2.76%", "2.86%", "3.85%"),

];

const VanimalRatio = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.summaryContainer}>
        <Box className={classes.text}>
          <Typography variant="h5" className="font-bold">
            Rarity Statistics
          </Typography>
          <Typography className="font-bold" color="primary">
            Subject to change
          </Typography>
        </Box>
        <TableContainer component={Paper} className={classes.paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Attributes</TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    Bengal Tiger
                  </Typography>
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    Chimpanzee
                  </Typography>
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    Empeor Penguin
                  </Typography>
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    Sumatran Elephant
                  </Typography>
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    The Pigeon
                  </Typography>
                </TableCell>
                <Divider orientation="vertical" />
                <TableCell align="center">
                  <Typography className={classes.titleTable}>
                    Axolotl
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="font-bold" component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.bengalTiger}</TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.chimpanzee}</TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.penguin}</TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.elephant}</TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.pigueon}</TableCell>
                  <Divider orientation="vertical" />
                  <TableCell align="center">{row.axolotl}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default VanimalRatio;
