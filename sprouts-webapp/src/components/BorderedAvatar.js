import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles({
  avatar: ({ size }) => ({
    width: size,
    height: size,
  }),
  circular: {
    position: "absolute",
    zIndex: 1,
  },
  image: {
    objectPosition: "center top",
  },
});

const BorderedAvatar = ({ color, size = 40, src }) => {
  const classes = useStyles({ color, size });
  
  return (
    <Box position="relative">
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={1}
        className={classes.circular}
      />
      <Avatar
        src={src}
        classes={{
          img: classes.image,
        }}
        className={classes.avatar}
      />
    </Box>
  );
};

export default BorderedAvatar;
