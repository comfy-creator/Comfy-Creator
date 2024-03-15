import { create } from 'zustand';
import { SettingsLookup, ThemeConfig } from '../types.ts';

interface SettingsStore {
  activeTheme: string;
  themes: Record<string, ThemeConfig>;
  settingsLookup: Record<string, SettingsLookup>;
  settingsValues: Record<string, any>;

  getSettingsValue: (name: string) => any;
  getSettingsLookup: (name: string) => SettingsLookup;
  addSettingsValue: (name: string, value: any) => void;
  setSettingsValues: (values: Record<string, any>) => void;
  addSettingsLookup: (name: string, value: SettingsLookup) => void;

  addThemes: (themes: Record<string, ThemeConfig>) => void;
  addTheme: (theme: ThemeConfig) => void;
  setActiveTheme: (theme: string) => void;
  getActiveTheme: () => ThemeConfig;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeTheme: 'dark',
  themes: {},
  settingsLookup: {},
  settingsValues: {},

  addSettingsValue: (name, value) => {
    set((state) => ({
      settingsValues: {
        ...state.settingsValues,
        [name]: value
      }
    }));
  },

  addSettingsLookup: (name, value) => {
    set((state) => ({
      settingsLookup: {
        ...state.settingsLookup,
        [name]: value
      }
    }));
  },

  setSettingsValues: (values) => {
    set((state) => ({
      settingsValues: {
        ...state.settingsValues,
        ...values
      }
    }));
  },

  getSettingsValue: (name) => {
    return get().settingsValues[name];
  },

  getSettingsLookup: (name) => {
    return get().settingsLookup[name];
  },

  // Theme Settings
  addThemes: (themes) => {
    return set((state) => ({
      themes: {
        ...state.themes,
        ...themes
      }
    }));
  },

  addTheme: (theme) => {
    return set((state) => ({
      themes: {
        ...state.themes,
        [theme.id]: theme
      }
    }));
  },

  setActiveTheme: (theme) => {
    return set((state) => {
      if (!state.themes[theme]) {
        throw new Error(`Theme ${theme} does not exist`);
      }

      return {
        activeTheme: theme
      };
    });
  },

  getActiveTheme: () => {
    return get().themes[get().activeTheme];
  }
}));
