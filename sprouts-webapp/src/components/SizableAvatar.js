import { makeStyles, Avatar } from "@material-ui/core";

const useStyles = makeStyles({
  sizedAvatar: ({ size }) => ({
    width: size || 40,
    height: size || 40,
  }),
});

const SizableAvatar = ({ size, ...rest }) => {
  const classes = useStyles({ size });

  return (
    <Avatar
      className={classes.sizedAvatar}
      {...rest}
    />
  );
};

export default SizableAvatar;
