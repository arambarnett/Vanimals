import React, { useState } from "react";
import { Tooltip } from "@material-ui/core";
import { cancelPropagation, copyToClipboard } from "utils";
import * as Sentry from "@sentry/nextjs";
import { useTranslation } from "i18n";

const ShareButton = ({ shareData, children, onShare, ...rest }) => {
  const [tooltip, setTooltip] = useState(false);
  const { t } = useTranslation();
  const share = async (e) => {
    cancelPropagation(e);
    if (onShare) onShare();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        Sentry.captureException(new Error(`Share exception: ${err}`));
      }
    } else {
      copyToClipboard(shareData.url);
      setTooltip(true);
      setTimeout(() => {
        setTooltip(false);
      }, 1500);
    }
  };
      
  const shareableElement = React.cloneElement(children, {
    style: { cursor: "pointer" },
    onMouseDown: cancelPropagation,
    onClick: share,
    ...rest,
  });

  return (
    <Tooltip
      open={tooltip}
      PopperProps={{
        disablePortal: true,
      }}
      disableHoverListener
      disableFocusListener
      disableTouchListener
      onClose={() => setTooltip(false)}
      title={t("SHARE_BUTTON")}
    >
      {shareableElement}
    </Tooltip>
  );
};

export default ShareButton;
