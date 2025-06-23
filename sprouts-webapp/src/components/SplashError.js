import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import Link from "next/link";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexGrow: 1,
  },
}));

const SplashError = ({ label }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Box>
        <Typography paragraph variant="h4">
          {label}
        </Typography>
        <Typography paragraph variant="h2">
          :(
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" color="primary">
            Go Back
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default SplashError;
