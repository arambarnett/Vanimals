import Box from "@material-ui/core/Box";
import { useTranslation } from "i18n";
import { getClientsideHref } from "utils";
import routes from "routes";
import OAuthButton from "./OAuthButton";
import FacebookIcon from "../Icons/Facebook";

const FacebookButton = ({ query, ...rest }) => {
  const { t } = useTranslation();

  const clientSide = getClientsideHref();
  
  const redirectUri = encodeURIComponent(`${clientSide.host}${routes.CALLBACK_FACEBOOK}${query || ""}`);

  const onClick = () => {
    if (clientSide.query.redirect) localStorage.setItem("storedRedirect", clientSide.query.redirect);
    const link = `https://www.facebook.com/v10.0/dialog/oauth?response_type=token&client_id=${process.env.NEXT_PUBLIC_FB_ID}&state=asd&redirect_uri=${redirectUri}`;
    window.location.href = link;
  };

  return (
    <Box width="100%">
      <OAuthButton
        id="btnLoginWithFacebook"
        text={t("CONTINUE_WITH_FACEBOOK")}
        icon={<FacebookIcon />}
        variant="contained"
        onClick={onClick}
        {...rest}
      />
    </Box>
  );
};

export default FacebookButton;
