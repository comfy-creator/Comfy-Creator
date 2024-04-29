import { ReactNode } from 'react';
import { useApiContext } from '../../contexts/api';

interface ComfySettingsDialogProps {
  open: boolean;
  content: ReactNode;
  closeDialog: () => void;
}

export function ComfySettingsDialog({ open, content, closeDialog }: ComfySettingsDialogProps) {
  const { appConfig, setConfig } = useApiContext();
  return (
    <dialog
      id="comfy-settings-dialog"
      style={{
        position: 'absolute',
        top: 50
      }}
      open={open}
    >
      <table className="comfy-modal-content comfy-table">
        <caption>Settings</caption>
        <tbody>
          {/* Settings for API */}
          {!appConfig.showAdvanceSettings && (
            <>
              <tr>
                <td>
                  <label className="">API Key</label>
                </td>
                <td>
                  <input
                    value={appConfig.apiKey}
                    onChange={(e) => setConfig({ apiKey: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label className="">Server URL</label>
                </td>
                <td>
                  <input
                    value={appConfig.serverUrl}
                    onChange={(e) => setConfig({ serverUrl: e.target.value })}
                  />
                </td>
              </tr>
            </>
          )}
          {content}
        </tbody>
      </table>

      <button type="button" style={{ cursor: 'pointer', width: '100%' }} onClick={closeDialog}>
        Close
      </button>
    </dialog>
  );
}
