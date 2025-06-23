import { SnackbarProvider } from "notistack";

const withToasts = (Component) => (props) => (
  <SnackbarProvider
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
  >
    <Component {...props} />
  </SnackbarProvider>
);

export default withToasts;
