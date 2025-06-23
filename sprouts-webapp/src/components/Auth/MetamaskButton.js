import { useTranslation } from "i18n";
import { useDialogs } from "store/Dialogs";
import SignInWithMetamaskDialog from "components/Dialogs/SignInWithMetamaskDialog";
import OAuthButton from "./OAuthButton";
import MetamastIcon from "../Icons/Metamask";

const MetamaskButton = (props) => {
  const { t } = useTranslation();
  const dialogs = useDialogs();

  const isMetamask = window.ethereum && window.ethereum.isMetaMask;
  const { disabled, callback } = props;

  const onClick = async () => {
    const dialog = dialogs.create({
      dialogType: SignInWithMetamaskDialog,
      callback: async () => {
        dialog.close();
        if (callback) await callback();
      },
    });
  };

  return (
    <OAuthButton
      id="btnLoginWithMetamask"
      text={t("CONTINUE_WITH_METAMASK")}
      icon={<MetamastIcon />}
      variant="contained"
      onClick={onClick}
      {...props}
      disabled={disabled || !isMetamask}
    />
  );
};

export default MetamaskButton;
