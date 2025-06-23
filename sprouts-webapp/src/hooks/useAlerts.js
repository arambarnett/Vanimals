import { useSnackbar } from "notistack";
import { IconButton } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

const useAlerts = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const snackbarClose = (key) => (
    <IconButton aria-label="delete" onClick={() => closeSnackbar(key)}>
      <CloseIcon fontSize="inherit" />
    </IconButton>
  );

  return {
    success: (text) => enqueueSnackbar(text, { variant: "success", action: snackbarClose }),
    error: (text) => enqueueSnackbar(text, { variant: "error", action: snackbarClose }),
  };
};

export default useAlerts;
