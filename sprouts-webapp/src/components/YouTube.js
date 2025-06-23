import React, { forwardRef } from "react";
import YoutubePlayer from "react-youtube";

const YouTube = (props, ref) => {
  const {
    videoId,
    playerProps,
    onReady,
    ...rest
  } = props;

  return (
    <YoutubePlayer
      opts={{
        width: "100%",
        playerVars: {
          controls: 1,
          disablekb: 1,
          modestbranding: 1,
          fs: 0,
          iv_load_policy: 3,
          rel: 0,
          loop: 0,
          playsinline: 1,
        },
      }}
      videoId={videoId}
      ref={ref}
      {...rest}
    />
  );
};

export default forwardRef(YouTube);
