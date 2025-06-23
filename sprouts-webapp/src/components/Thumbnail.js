import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles({
  image: ({ size }) => ({
    height: size,
    width: size,
    borderRadius: 4,
  }),
});

const Thumbnail = ({ children, src, size = 50, ...rest }) => {
  const classes = useStyles({ size });
  return (
    src
      ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt="thumbnail"
          className={classes.image}
          src={src}
          {...rest}
        />
      )
      : <Skeleton className={classes.image} />
  );
};

export default Thumbnail;
