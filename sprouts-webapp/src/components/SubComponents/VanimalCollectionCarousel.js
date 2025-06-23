import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Hidden } from "@material-ui/core";
import ReactCardCarousel from "react-card-carousel";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    height: 500,
    left: -175,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: 250,
    width: 250,
    background: theme.color.white,
    borderRadius: "2rem",
    padding: "1rem",
    cursor: "pointer",
    boxShadow: "0px 0px 10px 5px #00000026",
  },
  boxDescription: {
    borderRadius: "1rem",
    width: 400,
    height: 200,
    background: theme.color.white,
    position: "absolute",
    zIndex: -1,
    padding: "2rem",
    left: 200,
    paddingLeft: "5rem",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 0px 10px 5px #00000024",
    overflow: "hidden",
  },
  [theme.breakpoints.down("sm")]: {
    container: {
      left: 0,
    },
  },
}));

const VanimalCollectionCarousel = ({ items }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <ReactCardCarousel
        autoplay={false}
        autoplay_speed={2500}
        alignment="vertical"
        spread="narrow"
        disable_box_shadow
      >
        {items.map((item) => (
          <Box key={item.name} className={classes.card}>
            <img alt="Asset not found" src={item.image} width="auto" height="100%" />
            <Hidden smDown>
              <Box className={classes.boxDescription}>
                <Typography variant="body">{item.description}</Typography>
              </Box>
            </Hidden>
          </Box>
        ))}
      </ReactCardCarousel>
    </Box>
  );
};

export default VanimalCollectionCarousel;
