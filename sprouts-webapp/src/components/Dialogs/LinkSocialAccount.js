import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Button } from "@material-ui/core";
import FacebookButton from "components/Auth/FacebookButton";
import GoogleButton from "components/Auth/GoogleButton";
import DialogForm from "./DialogForm";

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    "& h3": {
      textTransform: "capitalize",
      marginBottom: "2rem",
      textAlign: "center",
    },
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
    },
  },
}));

const getButtonStyle = (bgColor) => ({ background: bgColor });

const LinkSocialAccount = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  onCancel,
  children,
  cash,
  ...rest
}) => {
  const classes = useStyles();
  
  const wrappedOnClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <DialogForm
      cross
      open
      fullScreen={false}
      onClose={wrappedOnClose}
      maxWidth="xs"
      {...rest}
    >
      <Box pt={8} className={classes.loginContainer}>
        <Typography className="font-bold" variant="h3">Link socials</Typography>
        <Box className={classes.innerContainer}>
          <FacebookButton
            fullWidth
            query="?type=link"
            text="Link Facebook"
            styles={getButtonStyle("#4E6297")}
          />
          <GoogleButton
            fullWidth
            query="?type=link"
            text="Link Google"
            styles={getButtonStyle("#C5331E")}
          />
        </Box>
        <Box width="100%" display="flex" justifyContent="center" mt={2}>
          <Button onClick={wrappedOnClose}>
            Skip
          </Button>
        </Box>
      </Box>
    </DialogForm>
  );
};

export default LinkSocialAccount;
