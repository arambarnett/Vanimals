import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { useTranslation } from "i18n";
import MetamaskButton from "components/Auth/MetamaskButton";
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

const LoginDialog = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  children,
  cash,
  refreshDecks,
  ...rest
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const onMetamaskLogin = async () => {
    if (onClose) onClose();
  };

  return (
    <DialogForm
      cross
      open
      title=""
      fullScreen={false}
      onClose={onClose}
      maxWidth="xs"
      {...rest}
    >
      <Box pt={8} className={classes.loginContainer}>
        <Typography className="font-bold" variant="h3">{t("SIGNIN")}</Typography>
        <Box className={classes.innerContainer}>
          <MetamaskButton
            fullWidth
            callback={onMetamaskLogin}
            styles={getButtonStyle("#F6851B")}
          />
        </Box>
        <Box my={4} textAlign="center">
          <Typography variant="caption">
            By registering you confirm you are over the
            age of 13 years old and have agreed to our terms of use and privacy policy
          </Typography>
        </Box>
      </Box>
    </DialogForm>
  );
};

export default LoginDialog;
