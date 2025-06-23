import React from "react";
import { IconButton, Tooltip, useTheme } from "@material-ui/core";
import { Brightness2, WbSunny } from "@material-ui/icons";
import { useThemeSelector } from "theme";

const ChangeThemeButton = () => {
  const toggleTheme = useThemeSelector();
  const theme = useTheme();
  return (
    <Tooltip title="Change theme">
      <IconButton onClick={toggleTheme}>
        {
          theme.palette.type === "light"
            ? <Brightness2 />
            : <WbSunny />
        }
        
      </IconButton>
    </Tooltip>
  );
};

export default ChangeThemeButton;
