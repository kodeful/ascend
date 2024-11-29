import { createTheme, type ThemeOptions } from "@mui/material/styles";
import type { Shadows } from "@mui/material/styles/shadows";

const defaultThemeOptions: ThemeOptions = {
  shadows: Array(25).fill("none") as Shadows,
  palette: {
    primary: {
      main: "#EE4F28",
      dark: "#D35B3E",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#A0C705",
    },
    error: {
      main: "#EB445A",
    },
    background: {
      default: "#F5EFEA",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "36px",
      fontWeight: 600,
    },
    h2: {
      fontSize: "32px",
      fontWeight: 600,
    },
    h3: {
      fontSize: "29px",
      fontWeight: 600,
    },
    h4: {
      fontSize: "26px",
      fontWeight: 600,
    },
    h5: {
      fontSize: "23px",
      fontWeight: 600,
    },
    h6: {
      fontSize: "20px",
      fontWeight: 600,
    },
    body1: {
      fontSize: "18px",
    },
    body2: {
      fontSize: "16px",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid #E1D7CB",
          borderRadius: "15px",
        },
        // root: {
        //   ".MuiAutocomplete-groupLabel": {
        //     backgroundColor: "#e2dbc7",
        //   },
        //   borderRadius: 4,
        //   overflow: "hidden",
        //   borderColor: "#EEE",
        //   borderWidth: "1px",
        //   borderStyle: "solid",
        // },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#E1D7CB",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 16px",
          fontWeight: 600,
          fontSize: 16,
          textTransform: "none",
          borderRadius: "6px",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
      styleOverrides: {
        root: {
          marginTop: "2px",
        },
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          // width: 36,
          // height: 36,
          // backgroundColor: "#DC7C65",
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
        style: {
          color: "#000",
          borderRadius: "6px",
        },
      },
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          "&.Mui-disabled": {
            backgroundColor: "#f9f8f5",
          },
        },
        input: {
          fontSize: 16,
          "&::placeholder": {
            color: "#646C60",
            opacity: 0.5,
          },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "#CBD5E1",
          // boxShadow: "0px 6px 14px 0px #2F520614",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        color: "#646C60",
        fontWeight: 500,
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "dense",
        size: "small",
        // inputProps: {
        //   style: {
        //     fontSize: "16px",
        //     color: "#000",
        //   },
        // },
      },
    },
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: "sm",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
    MuiList: {
      defaultProps: {
        dense: false,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          marginTop: "2px",
          border: "1px solid #C5C3C5",
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
};

const darkThemeOptions: () => ThemeOptions = () => {
  const themeOptions: any = {
    ...defaultThemeOptions,
  };

  themeOptions.palette.mode = "dark";

  return themeOptions;
};

const lightThemeOptions: () => ThemeOptions = () => {
  const themeOptions: any = {
    ...defaultThemeOptions,
  };

  themeOptions.palette.mode = "light";

  return themeOptions;
};

export const darkTheme = createTheme(darkThemeOptions());
export const lightTheme = createTheme(lightThemeOptions());
