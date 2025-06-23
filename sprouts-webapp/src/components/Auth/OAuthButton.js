import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  btnOAuth: {
    background: "#F3F3F3",
    borderRadius: 10,
    "& svg": {
      position: "absolute",
      top: 0,
      left: 0,
      borderRadius: 10,
      padding: 5,
      height: "100%",
    },
  },
  buttonText: {
    flex: 1,
    marginLeft: 54,
    textAlign: "left",
  },
}));

const OAuthButton = (props) => {
  const classes = useStyles();
  const { icon, text, styles, onClick } = props;
  
  return (
    <Button
      onClick={onClick}
      variant="contained"
      color="primary"
      startIcon={icon}
      {...props}
      className={classes.btnOAuth}
      style={styles}
    >
      <span className={classes.buttonText}>{text}</span>
    </Button>
  );
};

export default OAuthButton;
