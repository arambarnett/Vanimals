import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import APIEndpoints from "APIEndpoints";
import useHit from "hooks/useHit";
import useAlerts from "hooks/useAlerts";
import { useRouter } from "next/router";
import routes from "routes";
import DialogForm from "./DialogForm";

const SignInWithMetamaskDialog = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  children,
  callback,
  cash,
  ...rest
}) => {
  const [challenge, setChallenge] = useState("");
  const alerts = useAlerts();
  const hit = useHit();
  const router = useRouter();

  useEffect(() => {
    const getChallengeAndSign = async () => {
      try {
        const addresses = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (addresses.length < 0) {
          alerts.error("No valid addresses");
          throw Error;
        }
        
        const [address] = addresses;
        const response = await hit(APIEndpoints.SESSION.CREATE.CHALLENGE);
        if (response.error) {
          alerts.error("Couldn't sign in with metamask");
          throw Error;
        }

        setChallenge(response.challenge);

        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [address, `${response.challenge}`],
        });
 
        await router.push(`${routes.CALLBACK_METAMASK}?signature=${signature}&jwt=${response.jwt}`);
        if (callback) callback();
        else onClose();
      } catch (err) {
        if (err.message) alerts.error(err.message);
      }
    };

    getChallengeAndSign();
  }, []);
    
  return (
    <DialogForm
      cross
      open
      onClose={onClose}
      title="Sign in with metamask"
      fullScreen={false}
      {...rest}
    >
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {challenge
          ? (
            <>
              <Typography variant="caption" color="textSecondary">
                Sign this message with MetaMask
              </Typography>
              <Typography className="font-bold" variant="h6">
                {challenge}
              </Typography>
            </>
          )
          : <CircularProgress /> }
      </Box>
    </DialogForm>
  );
};

export default SignInWithMetamaskDialog;
