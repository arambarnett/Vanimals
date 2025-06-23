import { useTranslation } from "i18n";
import { getClientsideHref } from "utils";
import routes from "routes";
import OAuthButton from "./OAuthButton";
import GoogleIcon from "../Icons/Google";

const GoogleButton = ({ query, ...rest }) => {
  const { t } = useTranslation();

  const clientSide = getClientsideHref();
  const redirectUri = encodeURIComponent(
    `${getClientsideHref().host}${routes.CALLBACK_GOOGLE}${query || ""}`,
  );

  const onClick = () => {
    if (clientSide.redirect) localStorage.setItem("storedRedirect", clientSide.redirect);
    const link = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${redirectUri}&response_type=permission%20id_token&scope=email%20profile%20openid&openid.realm=&client_id=${
      process.env.NEXT_PUBLIC_GOOGLE_ID
    }&ss_domain=${encodeURIComponent(
      clientSide.host,
    )}&prompt=&fetch_basic_profile=true&gsiwebsdk=2`;
    window.location.href = link;
  };

  return (
    <OAuthButton
      id="btnLoginWithGoogle"
      text={t("CONTINUE_WITH_GOOGLE")}
      icon={<GoogleIcon />}
      variant="contained"
      onClick={onClick}
      {...rest}
    />
  );
};

export default GoogleButton;
