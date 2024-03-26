import React, { ReactNode, useEffect, useState } from 'react';
import { createUseContextHook } from './hookCreator';
import { LogEntry } from '../lib/types.ts';
import { useSettings } from './settings.tsx';
import { LoggingDialog } from '../components/dialogs/LoggingDialog.tsx';

interface LoggingContextType {
  clear: () => void;
  enabled: boolean;
  entries: LogEntry[];
  showLogs?: boolean;
}

const LoggingContext = React.createContext<LoggingContextType | null>(null);
export const useLogging = createUseContextHook(
  LoggingContext,
  'useLogging must be used within a LoggingContextProvider'
);

const loggers = ['log', 'warn', 'error', 'info', 'debug'] as const;
type LoggerType = (typeof loggers)[number];

export const LoggingContextProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [logger, setLogger] = useState<{ [K in LoggerType]?: (msg: any, ...args: any[]) => void }>(
    {}
  );

  const { addSetting, close: closeSettings } = useSettings();

  const patchConsole = () => {
    for (const type of loggers) {
      const orig = console[type];
      setLogger((logger) => ({
        ...logger,
        [type]: orig
      }));

      console[type] = function (...args) {
        orig.apply(console, args);
        addEntry('console', type, ...args);
      };
    }
  };

  const unpatchConsole = () => {
    // Restore original console functions
    for (const type of Object.keys(logger)) {
      const log = logger[type as LoggerType];
      if (log) {
        console[type as LoggerType] = log;
      }
    }
    setLogger({});
  };

  const catchUnhandled = () => {
    // Capture uncaught errors
    window.addEventListener('error', (e) => {
      addEntry('window', 'error', e.error ?? 'Unknown error');
      return false;
    });

    window.addEventListener('unhandledrejection', (e) => {
      addEntry('unhandledrejection', 'error', e.reason ?? 'Unknown error');
    });
  };

  const addEntry = (source: string, type: string, ...args: any[]) => {
    if (enabled) {
      setEntries((entries) => [
        ...entries,
        {
          type,
          source,
          message: args,
          timestamp: new Date()
        }
      ]);
    }
  };

  const enable = (value: boolean) => {
    if (value === enabled) return;
    if (value) {
      patchConsole();
    } else {
      unpatchConsole();
    }
    setEnabled(value);
  };

  const clear = () => {
    setEntries([]);
  };

  const log = (source: string, ...args: any[]) => {
    addEntry(source, 'log', ...args);
  };

  const addInitData = () => {
    if (!enabled) return;
    const source = 'ComfyUI.Logging';
    addEntry(source, 'debug', { UserAgent: navigator.userAgent });

    // const systemStats = await api.getSystemStats();
    // addEntry(source, 'debug', systemStats);
  };

  const addLoggingSetting = () => {
    const settingId = 'Comfy.Logging.Enabled';
    const htmlSettingId = settingId.replaceAll('.', '-');
    const setting = addSetting({
      id: settingId,
      name: settingId,
      defaultValue: true,
      onChange: (value: boolean) => {
        setEnabled(value);
      },
      type: (_name: string, setter: (value: boolean) => void, value: boolean) => {
        return (
          <tr>
            <td>
              <label htmlFor={htmlSettingId}>Logging</label>
            </td>
            <td>
              <input
                id={htmlSettingId}
                type="checkbox"
                checked={value}
                onChange={(event) => {
                  setter(event.target.checked);
                }}
              />
              <button
                onClick={() => {
                  closeSettings();
                  setShowLogs(true);
                }}
                style={{
                  fontSize: '14px',
                  display: 'block',
                  marginTop: '5px'
                }}
              >
                View Logs
              </button>
            </td>
          </tr>
        );
      }
    });
    setEnabled(setting.value);
  };

  useEffect(() => {
    addLoggingSetting();
    catchUnhandled();
    addInitData();
  }, []);

  return (
    <LoggingContext.Provider
      value={{
        clear,
        enabled,
        entries,
        showLogs
      }}
    >
      {children}
      {showLogs && <LoggingDialog />}
    </LoggingContext.Provider>
  );
};
