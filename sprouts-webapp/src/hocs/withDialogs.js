import { DialogProvider } from "store/Dialogs";

const withDialogs = (Component) => (props) => (
  <DialogProvider>
    <Component {...props} />
  </DialogProvider>
);

export default withDialogs;
