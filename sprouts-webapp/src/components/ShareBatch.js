import React from "react";
import {
  FacebookShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { Box } from "@material-ui/core";

const ShareBatch = ({ sharingText, sharingUrl, onShare }) => (
  <Box display="flex">
    <TwitterShareButton
      style={{ paddingLeft: 3, paddingRight: 3 }}
      url={sharingUrl}
      title={sharingText}
      id="share-with-twitter"
      onShareWindowClose={onShare}
    >
      <TwitterIcon size={32} round />
    </TwitterShareButton>

    <WhatsappShareButton
      style={{ paddingLeft: 3, paddingRight: 3 }}
      url={sharingUrl}
      title={sharingText}
      id="share-whats-app"
      separator={" "}
      onShareWindowClose={onShare}
    >
      <WhatsappIcon size={32} round />
    </WhatsappShareButton>

    <FacebookShareButton
      style={{ paddingLeft: 3, paddingRight: 3 }}
      url={sharingUrl}
      id="share-facebook"
      quote={sharingText}
      onShareWindowClose={onShare}
    >
      <FacebookIcon size={32} round />
    </FacebookShareButton>

    <TelegramShareButton
      style={{ paddingLeft: 3, paddingRight: 3 }}
      id="share-telegram"
      url={sharingUrl}
      title={sharingText}
      onShareWindowClose={onShare}
    >
      <TelegramIcon size={32} round />
    </TelegramShareButton>
  </Box>
);

export default ShareBatch;
