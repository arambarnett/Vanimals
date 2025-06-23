import { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import copy from "clipboard-copy";

const CopyToClipboard = ({ children }) => {
  const [state, setState] = useState({ showTooltip: false });
   
  const onCopy = (content) => {
    copy(content);
    setState({ showTooltip: true });
  };

  const handleOnTooltipClose = () => {
    setState({ showTooltip: false });
  };
  return (
    <Tooltip
      open={state.showTooltip}
      title="Copiado al portapales!"
      leaveDelay={1500}
      onClose={handleOnTooltipClose}
    >
      {children({ copy: onCopy })}
    </Tooltip>
  );
};

export default CopyToClipboard;
