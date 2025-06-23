import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  childrenFriendly: ({ noPadding }) => ({
    justifyContent: "left",
    ...(noPadding && { padding: 0 }),
    textAlign: "left",
    height: "max-content",
    textTransform: "unset",
    minWidth: "unset",
    "&:hover": {
      opacity: 0.9,
    },
  }),
});

const ChildrenFriendlyButton = ({ children, noPadding, ...rest }) => {
  const classes = useStyles({ noPadding });
  return (
    <Button
      classes={{
        root: classes.childrenFriendly,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ChildrenFriendlyButton;
