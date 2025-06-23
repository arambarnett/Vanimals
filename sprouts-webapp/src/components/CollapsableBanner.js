import { makeStyles } from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";

const useStyles = makeStyles({
  message: {
    margin: "auto",
  },
  action: {
    marginLeft: "unset",
  },
  root: {
    borderRadius: 0,
  },
});

const CollapsableBanner = ({ children }) => {
  const [visible, setVisible] = useState(true);
  const classes = useStyles();
  return (
    <Collapse direction="down" in={visible}>
      <Alert
        classes={{
          root: classes.root,
          action: classes.action,
          message: classes.message,
        }}
        onClose={() => setVisible(false)}
        variant="filled"
        icon={false}
        color="error"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Alert>
    </Collapse>

  );
};

export default CollapsableBanner;
