import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { forwardRef, useImperativeHandle, useState } from "react";

const AlertContainer = (props, ref) => {
  const [alert, setAlert] = useState(null);
  
  useImperativeHandle(ref, () => ({
    setAlert,
  }));

  return (
    <Collapse in={!!alert}>
      <Alert
        variant="outlined"
        {...alert}
      >
        {alert?.text}
      </Alert>
    </Collapse>
  );
};

export default forwardRef(AlertContainer);
