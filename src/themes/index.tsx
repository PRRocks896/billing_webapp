import { ReactNode, useMemo } from 'react';

// material-ui
import { createTheme, ThemeOptions, ThemeProvider, Theme, TypographyVariantsOptions, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project-imports
import { buildPalette } from './palette';
import Typography from './typography';
import CustomShadows from './custom-shadows';
import componentsOverride from './overrides';
import GlobalStyles from './GlobalStyles';

import { HEADER_HEIGHT, ThemeMode, CSS_VAR_PREFIX, DEFAULT_THEME_MODE } from 'config';
import useConfig from 'hooks/useConfig';

// types
import type {} from './extend-theme-types';

type ThemeCustomizationProps = {
  children: ReactNode;
};

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

export default function ThemeCustomization({ children }: ThemeCustomizationProps) {
  const {
    state: { themeDirection, presetColor, fontFamily, themeContrast }
  } = useConfig();

  const palette = useMemo(() => buildPalette(presetColor, themeContrast), [presetColor, themeContrast]);

  const themeTypography: TypographyVariantsOptions = useMemo<TypographyVariantsOptions>(() => Typography(fontFamily), [fontFamily]);

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: themeDirection,
      mixins: {
        toolbar: {
          minHeight: HEADER_HEIGHT,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      shape: {
        borderRadius: 8
      },
      typography: themeTypography,
      colorSchemes: {
        light: {
          palette: palette.light,
          customShadows: CustomShadows(palette.light, ThemeMode.LIGHT)
        },
        dark: {
          palette: palette.dark,
          customShadows: CustomShadows(palette.dark, ThemeMode.DARK)
        }
      },
      cssVariables: {
        cssVarPrefix: CSS_VAR_PREFIX,
        colorSchemeSelector: 'data-color-scheme'
      }
    }),
    [palette, themeDirection, themeTypography]
  );

  const themes: Theme = createTheme(themeOptions);
  themes.components = componentsOverride(themes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider disableTransitionOnChange theme={themes} modeStorageKey="theme-mode" defaultMode={DEFAULT_THEME_MODE}>
        <CssBaseline enableColorScheme />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
