import React, { useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Edit from "@material-ui/icons/Edit";
import AlertContainer from "components/AlertContainer";
import SelectImage from "components/SelectImage";
import ChildrenFriendlyButton from "components/ChildrenFriendlyButton";
import {
  TextField,
  Box,
  Button,
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";
import * as yup from "yup";
import APIEndpoints from "APIEndpoints";
import { useFormik } from "formik";
import { useSession } from "store/Session";
import { useTranslation } from "i18n";
import useHit from "hooks/useHit";
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

const EditUserDialog = ({
  open,
  title,
  cross,
  subtitle,
  actions,
  onClose,
  children,
  cash,
  ...rest
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const alertContainer = useRef();
  const [loadingImage, setLoadingImage] = useState(false);
  const { data: session, refresh } = useSession();
  const hit = useHit();

  const formik = useFormik({
    initialValues: {
      avatar: session.user.avatar,
      username: session.user.username,
    },
    validationSchema,
    onSubmit: async (data) => {
      const { error } = await hit(APIEndpoints.USER.UPDATE, data);
      if (error) {
        alertContainer.current.setAlert({
          variant: "error",
          text: t("USERNAME_ALREADY_USED"),
        });
      } else {
        refresh();
        alertContainer.current.setAlert({
          color: "success",
          text: t("PROFILE_UPDATED"),
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    },
  });

  const onSelect = (assetUrl) => {
    setLoadingImage(false);
    formik.setFieldValue("avatar", assetUrl);
  };

  return (
    <DialogForm
      cross
      open
      onClose={onClose}
      title={t("EDIT_PROFILE")}
      fullScreen={false}
      actions={(
        <Button
          disabled={formik.isSubmitting}
          onClick={formik.handleSubmit}
          variant="contained"
          color="secondary"
        >
          {t("SAVE")}
        </Button>
      )}
      {...rest}
    >
      <Box className={classes.inputs}>
        <SelectImage
          onLoading={() => setLoadingImage(true)}
          onChange={onSelect}
        >
          <ChildrenFriendlyButton>
            {loadingImage ? (
              <CircularProgress />
            ) : (
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
            )}
          </ChildrenFriendlyButton>
        </SelectImage>
        <TextField
          id="username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && !!formik.errors.username}
          helperText={formik.touched.username && formik.errors.username}
          label={t("USERNAME")}
          variant="outlined"
          fullWidth
        />
      </Box>
      <AlertContainer ref={alertContainer} />
    </DialogForm>
  );
};

export default EditUserDialog;
