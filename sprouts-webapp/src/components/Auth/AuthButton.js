import { Button } from "@material-ui/core";
import { useDialogs } from "store/Dialogs";
import LoginDialog from "components/Dialogs/LoginDialog";

const AuthButton = ({ children, ...rest }) => {
  const dialogs = useDialogs();

  const handleClick = () => {
    dialogs.create({ dialogType: LoginDialog });
  };

  return (
    <Button {...rest} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default AuthButton;
