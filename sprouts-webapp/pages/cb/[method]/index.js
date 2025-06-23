import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import withNoAuthentication from "hocs/withNoAuthentication";
import withMainLayout from "hocs/withMainLayout";

import querystring from "query-string";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import routes from "routes";
import { useSession } from "store/Session";
import useHit from "hooks/useHit";
import { useTranslation } from "i18n";
import APIEndpoints from "APIEndpoints";
import useAlerts from "hooks/useAlerts";
import { useDialogs } from "store/Dialogs";
import { Button, Grow } from "@material-ui/core";
import { SentimentVeryDissatisfied } from "@material-ui/icons";
import VerticalArragement from "components/VerticalArragement";
import LoginDialog from "components/Dialogs/LoginDialog";
import LinkSocialAccount from "components/Dialogs/LinkSocialAccount";
import { addMinutes, isFuture } from "date-fns";
import ConfirmProfile from "components/Dialogs/ConfirmProfileDialog";

const OAuthCallback = () => {
  const [error, setError] = useState();
  const { t } = useTranslation();
  const dialogs = useDialogs();
  const session = useSession();
  const router = useRouter();
  const alerts = useAlerts();
  const hit = useHit();

  const tryAgain = () => {
    dialogs.create({
      dialogType: LoginDialog,
    });
  };

  useEffect(() => {
    const login = async () => {
      let newSession;
      const hashParams = querystring.parse(window.location.hash);
      switch (router.query.method) {
      case "facebook":
        newSession = await hit(APIEndpoints.SESSION.CREATE.WITH_FACEBOOK, {
          token: hashParams.access_token,
        });
        break;
      case "google":
        newSession = await hit(APIEndpoints.SESSION.CREATE.WITH_GOOGLE, {
          token: hashParams.id_token,
        });
        break;
      case "metamask":
        newSession = await hit(APIEndpoints.SESSION.CREATE.WITH_METAMASK, {
          signature: router.query.signature,
          jwt: router.query.jwt,
        });
        break;
      default:
        router.push(routes.INDEX);
        alerts.error(t("ERROR_LOGGING"));
        break;
      }
       
      if (!newSession.error) {
        localStorage.setItem("session", JSON.stringify(newSession));

        if (newSession.user) {
          const linkedAnySocials = newSession.user.authenticationMethods.some((am) => am.method !== "metamask");
          if (!linkedAnySocials) {
            await dialogs.confirm({
              dialogType: LinkSocialAccount,
            });
          }

          const justSignUp = isFuture(addMinutes(new Date(newSession.user.createdAt), 2));

          if (justSignUp) {
            await dialogs.confirm({
              dialogType: ConfirmProfile,
              newSession,
            });
          }
        }
      
        session.refresh();
      } else {
        setError(newSession.error);
      }
    };

    const link = async () => {
      let newSession;
      const hashParams = querystring.parse(window.location.hash);
      switch (router.query.method) {
      case "facebook":
        newSession = await hit(APIEndpoints.USER.LINK_AUTH_METHOD, {
          method: "facebook",
          token: hashParams.access_token,
        });
        break;
      case "google":
        newSession = await hit(APIEndpoints.USER.LINK_AUTH_METHOD, {
          method: "google",
          token: hashParams.id_token,
        });
        break;
      default:
        router.push(routes.INDEX);
        alerts.error(t("ERROR_LOGGING"));
        break;
      }

      if (!newSession.error) {
        session.refresh();
        router.push(routes.INDEX);
      } else {
        setError(newSession.error);
      }
    };

    if (
      router.isReady
      && router.query.method
      && router.query.method !== "undefined"
    ) {
      if (router.query.type === "link") link();
      else login();
    }
  }, [router]);

  return (
    <Box
      width="sm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      flexGrow={1}
      height="100%"
    >
      <Grow in={error}>
        <VerticalArragement spacing>
          <Typography className="font-bold" variant="h5">
            {t(error) || "There's been an error signing in"}
          </Typography>
          <Box>
            <SentimentVeryDissatisfied fontSize="large" />
          </Box>
          <Button onClick={tryAgain} variant="contained" color="primary">
            Try Again
          </Button>
        </VerticalArragement>
      </Grow>
      <Grow in={!error}>
        <VerticalArragement>
          <Typography className="font-bold" color="primary" variant="h5">
            {t("LOADING")}
          </Typography>
          <Box width={200}>
            <LinearProgress />
          </Box>
        </VerticalArragement>
      </Grow>
    </Box>
  );
};

export default withMainLayout(withNoAuthentication(OAuthCallback));
