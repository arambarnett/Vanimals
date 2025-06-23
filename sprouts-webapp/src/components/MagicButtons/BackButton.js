import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useRouter } from "next/router";
import { HOME } from "routes";

export const BackButton = ({ children }) => {
  const router = useRouter();

  const goBack = () => {
    if (router) router.goBack();
    else router.push(HOME);
  };

  if (children) return React.cloneElement(children, { onClick: goBack });
  return (
    <Tooltip title="Go back" arrow>
      <IconButton onClick={goBack}>
        <ArrowBack color="secondary" />
      </IconButton>
    </Tooltip>
  );
};
