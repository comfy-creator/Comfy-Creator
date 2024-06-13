import { Theme } from './Theme';
import { useSettingsStore } from '../store/settings';

const { setActiveTheme, getActiveTheme } = useSettingsStore.getState();

export const colorSchemeSettings = {
  id: 'theme',
  name: 'Color Scheme',
  defaultValue: 'dark',
  type: (_name: string, setter: (value: string) => void, value: string) => (
    <Theme value={value} onChange={setter} />
  ),
  async onChange(value: string) {
    if (!value) {
      return;
    }

    setActiveTheme(value);
    const theme = getActiveTheme();
    for (const key in theme.colors.CSSVariables) {
      const value = theme.colors.CSSVariables[key];

      document.documentElement.style.setProperty(`--${key}`, value);
    }
  }
};
