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


      <table className="flex flex-col comfy-table">
        <caption>Settings</caption>
        <tbody>
          {/* Settings for API */}
          {!appConfig.showAdvanceSettings && (
            <>

              <tr className='bg-trOddBgColor'>
                <td className='border-1 border-borderColor p-2'>
                  <label className="">API Key</label>
                </td>
                <td className='border-1 border-borderColor p-2'>
                  <input
                    value={appConfig.apiKey}
                    onChange={(e) => setConfig({ apiKey: e.target.value })}
                  />
                </td>
              </tr>
              <tr className='bg-trEvenBgColor'>
                <td className='border-1 border-borderColor p-2'>
                  <label className="">Server URL</label>
                </td>
                <td className='border-1 border-borderColor p-2' >
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