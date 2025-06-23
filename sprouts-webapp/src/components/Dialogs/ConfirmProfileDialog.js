import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Button,
  Avatar,
  Badge,
  Box,
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import ChildrenFriendlyButton from "components/ChildrenFriendlyButton";
import AlertContainer from "components/AlertContainer";
import SelectImage from "components/SelectImage";
import { useTranslation } from "i18n";
import { useFormik } from "formik";
import useHit from "hooks/useHit";
import * as yup from "yup";
import APIEndpoints from "APIEndpoints";
import DialogForm from "./DialogForm";

const useStyles = makeStyles({
  inputs: {
    display: "flex",
    marginBottom: 8,
    alignItems: "center",
    "& > :first-child": {
      marginRight: 16,
    },
  },
  badge: {
    "& span": {
      height: 30,
    },
  },
});

const validationSchema = yup.object({
  avatar: yup.string().required(),
  username: yup
    .string()
    .matches(/^[a-z0-9]+$/i, "Letters and numbers only")
    .min(3, "Use at least 3 letters")
    .max(30, "Maximum 30 letters")
    .required("Username is required"),
});

const ConfirmProfile = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  children,
  callback,
  newSession,
  cash,
  ...rest
}) => {
  const [disabled, setDisabled] = useState(false);
  const alertContainer = useRef();
  const { t } = useTranslation();
  const classes = useStyles();
  const hit = useHit({ accessToken: newSession.accessToken });

  const formik = useFormik({
    initialValues: {
      avatar: newSession.user.avatar,
      username: newSession.user.username,
    },
    validationSchema,
    onSubmit: async ({ username, avatar }) => {
      const normalizedUsername = username
        .normalize("NFD")
        .replace(/[\u0300-\u036f]|\s|[\W_]+/g, "")
        .toLowerCase();

      const { error } = await hit(APIEndpoints.USER.UPDATE, {
        avatar,
        username: normalizedUsername,
      });
      if (error) {
        alertContainer.current.setAlert({
          color: "error",
          text: t("USERNAME_ALREADY_USED"),
        });
      } else {
        alertContainer.current.setAlert({
          color: "success",
          text: t("PROFILE_UPDATED"),
        });
        setDisabled(true);
        setTimeout(() => {
          callback();
          onClose();
        }, 2500);
      }
    },
  });

  const onSelect = (assetUrl) => {
    formik.setValues({ ...formik.values, avatar: assetUrl });
  };

  return (
    <DialogForm
      cross
      open
      title={t("COMPLETE_YOUR_PROFILE")}
      subtitle={t("CHANGE_PROFILE_LATER")}
      fullScreen={false}
      actions={(
        <>
          <Button
            disabled={formik.isSubmitting || disabled}
            onClick={formik.handleSubmit}
            variant="contained"
            color="secondary"
          >
            {t("SAVE")}
          </Button>
        </>
      )}
      {...rest}
    >
      <Box>
        <Box className={classes.inputs}>
          <SelectImage onChange={onSelect}>
            <ChildrenFriendlyButton>
              <Badge
                className={classes.badge}
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                color="primary"
                badgeContent={<Edit fontSize="small" />}
              >
                <Avatar
                  style={{
                    width: 70,
                    height: 70,
                  }}
                  src={formik.values.avatar}
                />
              </Badge>
            </ChildrenFriendlyButton>
          </SelectImage>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              id="username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && !!formik.errors.username}
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              variant="outlined"
              fullWidth
            />
            <Typography display="block" variant="caption" color="textPrimary">
              {t("THIS_WILL_BE_PUBLIC")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <AlertContainer ref={alertContainer} />
    </DialogForm>
  );
};

export default ConfirmProfile;
