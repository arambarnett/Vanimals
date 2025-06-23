import {
  Box,
  Button,
  Typography,
} from "@material-ui/core";
import {
  Error as ErrorIcon,
} from "@material-ui/icons";

const ErrorBox = ({ message, onTryAgain }) => (
  <Box textAlign="center">
    <ErrorIcon style={{ color: "#d90404", fontSize: 75 }} />
    <Typography variant="subtitle1">Payment error</Typography>
    <Typography variant="caption">
      {message || "Something went wrong trying to make the payment"}
    </Typography>
    <Box display="flex" flexDirection="column" gridGap={8} mt={2}>
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={onTryAgain}
      >
        Try again
      </Button>
    </Box>
  </Box>
);

export default ErrorBox;
