// The container is used to provider dependency resolution for plugins

import React, { createContext, ReactNode, useState } from 'react';
import { createUseContextHook } from './hookCreator';
import { ComfySettingsDialog } from '../components/dialogs/ComfySettingsDialog';
import {
  BooleanInput,
  ComboInput,
  NumberInput,
  SliderInput,
  TextInput
} from '../components/SettingInputs';
import { ComboOption } from '../types/many';
import { useApiContext } from './api';
import { useSettingsStore } from '../store/settings';

interface ISettingsContext {
  show: () => void;
  close: () => void;
  getId: (id: string) => string;
  loadCurrentSettings: () => Promise<void>;
  addSetting: (setting: IAddSetting) => any;
  setSettingValue: (id: string, value: any) => void;
  getSettingValue: (id: string, defaultValue?: any) => any;
}

interface IAddSetting {
  type: any;
  id: string;
  name: string;
  attrs?: object;
  tooltip?: string;
  defaultValue?: any;
  onChange?: (...arg: any[]) => any;
  options?: ComboOption[] | ((value: string) => (ComboOption | string)[]);
}

const Settings = createContext<ISettingsContext | null>(null);

export const SettingsContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    settingsLookup,
    addSettingsLookup,
    addSettingsValue,
    setSettingsValues,
    getSettingsValue,
    getSettingsLookup
  } = useSettingsStore();

  const { getSettings, storeSetting } = useApiContext();
  const [content, setContent] = useState<ReactNode>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const storageLocation = 'browser',
    isNewUserSession = true;

  const getLocalSettings = () => {
    const values: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      if (keys[i].startsWith('Comfy.Settings.')) {
        const item = localStorage.getItem(keys[i]) as string;
        try {
          values[keys[i]] = JSON.parse(item);
        } catch (e) {
          values[keys[i]] = item;
        }
      }
    }

    return values;
  };

  const loadCurrentSettings = async () => {
    const settingsVal = storageLocation === 'browser' ? getLocalSettings() : await getSettings();
    setSettingsValues(settingsVal);

    // Trigger onChange for any settings added before load
    for (const id in settingsLookup) {
      getSettingsLookup(id)?.onChange?.(getSettingValue(id));
    }
  };

  const getId = (id: string) => {
    if (storageLocation === 'browser') {
      id = 'Comfy.Settings.' + id;
    }

    return id;
  };

  const getSettingValue = (id: string, defaultValue?: any) => {
    const lookupId = getId(id);
    let value = getSettingsValue(lookupId);
    if (value === undefined || value === null) {
      addSettingsValue(lookupId, defaultValue);
      value = defaultValue;
    }

    return value;
  };

  const setSettingValueAsync = async (id: string, value: any) => {
    localStorage.setItem('Comfy.Settings.' + id, JSON.stringify(value)); // backwards compatibility for extensions keep setting in storage

    const oldValue = getSettingValue(id);
    addSettingsValue(getId(id), value);

    if (id in settingsLookup) {
      getSettingsLookup(id)?.onChange?.(value, oldValue);
    }

    await storeSetting(id, value);
  };

  const setSettingValue = (id: string, value: any) => {
    setSettingValueAsync(id, value).catch((err) => {
      // alert(`Error saving setting '${id}'`);
      console.error(err);
    });
  };

  const show = () => {
    setContent(() => {
      return [
        // <tr key={0} style={{ display: 'none' }}>
        //   <th />
        //   <th style={{ width: '33%' }} />
        // </tr>,
        ...Object.values(settingsLookup)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((s, i) => s.render(i + 1))
      ];
    });

    setOpenDialog(true);
  };

  const addSetting = ({
    id,
    name,
    type,
    defaultValue,
    onChange,
    attrs = {},
    tooltip = '',
    options = []
  }: IAddSetting) => {
    if (!id) {
      throw new Error('Settings must have an ID');
    }

    if (id in settingsLookup && import.meta.env.PROD) {
      throw new Error(`Setting ${id} of type ${type} must have a unique ID.`);
    }

    const skipOnChange = false;
    let value = getSettingValue(id);

    if (!value) {
      if (isNewUserSession) {
        // Check if we have a localStorage value but not a setting value and we are a new user
        const localValue = localStorage.getItem('Comfy.Settings.' + id);
        if (localValue) {
          value = JSON.parse(localValue);
          setSettingValue(id, value); // Store on the server
        }
      }
      if (value == null) {
        value = defaultValue;
      }
    }

    // Trigger initial setting of value
    if (!skipOnChange) {
      onChange?.(value, undefined);
    }

    const setting = {
      id,
      onChange,
      name,
      render: (i: any) => {
        const setter = (v: any) => {
          onChange?.(v, value);

          setSettingValue(id, v);
          value = v;
        };
        value = getSettingValue(id, defaultValue);

        let element: ReactNode;

        function buildSettingInput(element: ReactNode) {
          return (
            <tr key={i}>
              <td>
                <label htmlFor={id} className={tooltip !== '' ? 'comfy-tooltip-indicator' : ''}>
                  {name}
                </label>
              </td>

              <td>{element}</td>
            </tr>
          );
        }

        if (typeof type === 'function') {
          element = type(name, setter, value, attrs);
        } else {
          switch (type) {
            case 'boolean':
              element = buildSettingInput(
                <BooleanInput id={id} onChange={onChange} setSettingValue={setSettingValue} />
              );
              break;
            case 'number':
              element = buildSettingInput(<NumberInput id={id} attrs={attrs} setter={setter} />);
              break;
            case 'slider':
              element = buildSettingInput(<SliderInput id={id} attrs={attrs} setter={setter} />);
              break;
            case 'combo':
              element = buildSettingInput(
                <ComboInput setter={setter} options={options} value={getSettingValue(id)} />
              );
              break;
            case 'text':
            default:
              if (type !== 'text') {
                console.warn(`Unsupported setting type '${type}, defaulting to text`);
              }

              element = buildSettingInput(<TextInput id={id} setter={setter} attrs={attrs} />);
              break;
          }
        }
        if (tooltip) {
          element = (
            <div title={tooltip} style={{ display: 'inline-block' }}>
              {element}
            </div>
          );
        }

        return element;
      }
    };

    addSettingsLookup(id, setting);

    return {
      get value() {
        return getSettingValue(id, defaultValue);
      },
      set value(v) {
        setSettingValue(id, v);
      }
    };
  };

  const close = () => {
    setOpenDialog(false);
  };

  return (
    <Settings.Provider
      value={{
        getId,
        show,
        close,
        addSetting,
        setSettingValue,
        getSettingValue,
        loadCurrentSettings
      }}
    >
      {children}
      <ComfySettingsDialog closeDialog={close} open={openDialog} content={content} />
    </Settings.Provider>
  );
};

export const useSettings = createUseContextHook(
  Settings,
  'useSettings must be used within a SettingsContextProvider'
);
