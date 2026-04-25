// material-ui
import { PaletteMode } from '@mui/material';

// project-imports
import ThemeOption from './theme';
import { ThemeMode } from 'config';
import { extendPaletteWithChannels, withAlpha } from 'utils/colorUtils';

// types
import { PresetColor } from 'types/config';
import { PaletteThemeProps } from 'types/theme';

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

export function buildPalette(presetColor: PresetColor, contrast: boolean = false) {
  const lightPaletteColor: PaletteThemeProps = ThemeOption(presetColor, ThemeMode.LIGHT);
  const darkPaletteColor: PaletteThemeProps = ThemeOption(presetColor, ThemeMode.DARK);

  const commonColor = { common: { black: '#000', white: '#fff' } };

  const extendedLight = extendPaletteWithChannels(lightPaletteColor);
  const extendedDark = extendPaletteWithChannels(darkPaletteColor);
  const extendedCommon = extendPaletteWithChannels(commonColor);

  return {
    light: {
      mode: 'light' as PaletteMode,
      ...extendedCommon,
      ...extendedLight,
      text: {
        primary: extendedLight.secondary[800],
        secondary: extendedLight.secondary.main,
        disabled: extendedLight.secondary[400]
      },
      action: { disabled: extendedLight.secondary.light },
      divider: withAlpha(extendedLight.secondary.light!, 0.65),
      background: {
        paper: commonColor.common.white,
        default: contrast ? commonColor.common.white : extendedLight.secondary.lighter
      }
    },
    dark: {
      mode: 'dark' as PaletteMode,
      ...extendedCommon,
      ...extendedDark,
      text: {
        primary: withAlpha(extendedDark.secondary.darker!, 0.87),
        secondary: withAlpha(extendedDark.secondary.darker!, 0.45),
        disabled: withAlpha(extendedDark.secondary.darker!, 0.1)
      },
      action: { disabled: extendedDark.secondary.light },
      divider: withAlpha(extendedDark.secondary.darker!, 0.05),
      background: {
        paper: extendedDark.secondary[100],
        default: extendedDark.secondary.lighter
      }
    }
  };
}
