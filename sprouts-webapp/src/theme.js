import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/styles";
import { createContext, useContext, useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";

const defaultColors = {
  white: "#fff",
  black: "#000",
  grey: "#f4f5f7",
  transparent: "#ffffff00",
};

const paletteColors = {
  text: "#384442",
  primary: "#6d64eb",
  secondary: "#a7cdf9",
  detailPrimary: "#c6bff8",
  detailSecondary: " #fad99a",
  gradient: "linear-gradient(65.5deg, #9ebef8 2.7%, #9edff8 94.47%)",
};

export const light = responsiveFontSizes(
  createTheme({
    color: { ...defaultColors, ...paletteColors },
    size: {
      fullWidth: "100%",
      fullHeight: "100%",
      fullViewportWidth: "100vw",
      fullViewportHeight: "100vh",
      fullWidthMinus: (value) => `calc(100vw - ${value})`,
      fullHeightMinus: (value) => `calc(100vh - ${value})`,
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: "none",
        },
      },
    },
    props: {
      MuiTooltip: {
        arrow: true,
        style: {
          pointerEvents: "all",
        },
      },
      MuiButton: {
        disableFocusRipple: true,
        disableElevation: true,
      },
      MuiDivider: {
        style: {
          marginTop: 16,
          marginBottom: 16,
        },
      },
    },
    typography: {
      allVariants: {
        fontFamily: "Red Hat Display",
      },
      button: {
        textTransform: "capitalize",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    palette: {
      type: "light",
      primary: {
        main: paletteColors.primary,
      },
      secondary: {
        main: paletteColors.primary,
      },
      text: {
        primary: paletteColors.text,
        secondary: paletteColors.primary,
      },
      background: {
        default: defaultColors.grey,
        paper: defaultColors.white,
      },
      common: {
        black: defaultColors.black,
        white: defaultColors.white,
      },
    },
  }),
);

export const dark = responsiveFontSizes(
  createTheme({
    overrides: {
      MuiChip: {
        labelSmall: {
          paddingLeft: 4,
          fontSize: 10,
          paddingRight: 4,
        },
      },
    },
    props: {
      MuiTooltip: {
        arrow: true,
        style: {
          pointerEvents: "all",
        },
      },
      MuiButton: {
        disableFocusRipple: true,
      },
      MuiDivider: {
        style: {
          marginTop: 16,
          marginBottom: 16,
        },
      },
    },
    typography: {
      allVariants: {
        fontFamily: "Red Hat Display",
      },
      button: {
        textTransform: "capitalize",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 4,
    },
    palette: {
      type: "dark",
      primary: {
        main: "#f7888c",
        contrastText: "#fff",
      },
      secondary: {
        main: "#97b9c9",
        contrastText: "#fff",
      },
      background: {
        paper: "#444",
        default: "#222",
      },
      common: {
        black: "#191919",
        white: "#FCFCFC",
      },
    },
  }),
);

export const ThemeSelectorContext = createContext({
  theme: "",
});

export const useThemeSelector = () => useContext(ThemeSelectorContext);

/* eslint-disable-next-line react/display-name */
export const withTheme = (Component) => (props) => {
  const [t, setT] = useState("light");
  const toggleTheme = () => {
    const newTheme = t === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setT(newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setT(savedTheme);
    }
  }, []);
  const theme = t === "light" ? light : dark;

  return (
    <ThemeSelectorContext.Provider value={toggleTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    </ThemeSelectorContext.Provider>
  );
};
