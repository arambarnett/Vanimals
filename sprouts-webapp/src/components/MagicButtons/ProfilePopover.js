import { makeStyles } from "@material-ui/core/styles";
import EditUserDialog from "components/Dialogs/EditUserDialog";
import Popoverize from "components/Popoverize";
import { useTranslation } from "i18n";
import { useDialogs } from "store/Dialogs";
import { MenuItem, Box, ListItemText, Typography, IconButton } from "@material-ui/core";
import useHit from "hooks/useHit";
import { useSession } from "store/Session";
import APIEndpoints from "APIEndpoints";
import { useBlockchain } from "store/Blockchain";
import { useSnackbar } from "notistack";
import { chopString, copyToClipboard } from "utils";
import { Link as LinkIcon, Close as CloseIcon } from "@material-ui/icons";
import QRCode from "react-qr-code";

const useStyles = makeStyles((theme) => ({
  ckbAddress: {
    textAlign: "center",
    textTransform: "none",
    overflowWrap: "break-word",
    maxWidth: theme.size.fullWidth,
  },
}));

const ProfilePopover = ({ children, ...rest }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dialogs = useDialogs();
  const { addressCKB, balance } = useBlockchain();
  const { refresh } = useSession();
  const hit = useHit();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const signOut = async () => {
    const shouldCloseSession = await dialogs.confirm({
      title: t("ARE_YOU_SURE_SIGN_OUT"),
      maxWidth: "xs",
      fullScreen: false,
    });
    if (shouldCloseSession) {
      localStorage.removeItem("session");
      refresh();
    }
  };

  const onDelete = async () => {
    const shouldDelete = await dialogs.confirm({
      title: `${t("DELETE_ACCOUNT")}?`,
      maxWidth: "xs",
      fullScreen: false,
      continueLabel: t("DELETE"),
    });
    if (shouldDelete) {
      const { error } = await hit(APIEndpoints.USER.DELETE);
      if (!error) {
        localStorage.removeItem("session");
        window.location.reload();
      }
    }
  };

  const onEditUser = () => {
    dialogs.create({
      dialogType: EditUserDialog,
    });
  };

  const onBalance = () => {
    const dialog = dialogs.create({
      title: "This is your CKB Balance",
      children: (
        <>
          <Typography>
            You can inspect your CKB account, balance, transactions and more in the explorer!
          </Typography>
          <Box marginTop={2} textAlign="center">
            <QRCode value={addressCKB} />
            <br />
            <Typography
              color="textSecondary"
              className={classes.ckbAddress}
            >
              {addressCKB}
            </Typography>
          </Box>
        </>
      ),
      actions: [
        { text: "Cancel", onClick: () => dialog.close() },
        { text: "Copy address",
          onClick: () => {
            copyToClipboard(addressCKB);
            enqueueSnackbar("CKB address copied successfully", {
              variant: "success",
              persist: false,
              action: (key) => (
                <IconButton aria-label="delete" onClick={() => closeSnackbar(key)}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              ),
            });
          } },
        { text: "Go to the explorer",
          endIcon: <LinkIcon />,
          variant: "outlined",
          onClick: () => {
            window.open(`https://explorer.nervos.org/aggron/address/${addressCKB}`, "_blank");
          } },
      ],
    });
  };

  return (
    <Popoverize
      {...rest}
      options={(
        <Box>
          <MenuItem onClick={onBalance}>
            <ListItemText
              primary={(
              `${t("BALANCE")}: ${balance} CKB`
              )}
              secondary={(
                <Typography variant="caption">
                  {chopString(addressCKB, 12)}
                </Typography>
              )}
            />
          </MenuItem>
          <MenuItem id="mibDeleteAccount" onClick={onDelete}>
            {t("DELETE_ACCOUNT")}
          </MenuItem>
          <MenuItem id="mibEditProfile" onClick={onEditUser}>
            {t("EDIT_PROFILE")}
          </MenuItem>
          <MenuItem id="mibSignOut" onClick={signOut}>
            {t("SIGNOUT")}
          </MenuItem>
        </Box>
      )}
    >
      {children}
    </Popoverize>
  );
};

export default ProfilePopover;
