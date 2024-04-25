import { ReactNode, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useSettings } from '../../contexts/settings';
import { useWorkflow } from '../../lib/hooks/useWorkflow';
import ExtraOptions from './menu/ExtraOptions';
import SaveButton from './menu/SaveButton';
import DevSaveButton from './menu/DevSaveButton';
import ClearButton from './menu/ClearButton';
import LoadDefaultButton from './menu/LoadDefaultButton';
import { ComfyPromptStatus } from '../../types/comfy';
import { toggleSwitch } from '../../lib/utils/ui';
import { ComfyList } from '../ComfyList';
import { useFlowStore } from '../../store/flow';
import { loadLegacyWorkflow } from '../../lib/handlers/loadLegacy';
import { useGraph } from '../../lib/hooks/useGraph';
import { isLegacySerializedGraph } from '../../lib/utils';

type AutoQueueMode =
  | {
      text: string;
      value?: string;
      tooltip?: string;
    }
  | string
  | null;

const ControlPanel = () => {
  const { addSetting, show: showSettings } = useSettings();
  const { nodeDefs } = useFlowStore((state) => ({ nodeDefs: state.nodeDefs }));
  const { submitWorkflow } = useWorkflow();
  const { loadSerializedGraph } = useGraph();
  const lastExecutionError = false;

  const [batchCount, setBatchCount] = useState(1);
  const [lastQueueSize, setLastQueueSize] = useState(0);
  const [queueList, setQueueList] = useState<ReactNode>([]);
  const [historyList, setHistoryList] = useState<ReactNode>([]);
  const [autoQueueMode, setAutoQueueMode] = useState<AutoQueueMode>(null);
  const [graphHasChanged, setGraphHasChanged] = useState(false);
  const [autoQueueEnabled, setAutoQueueEnabled] = useState(false);
  const [promptFilename, setPromptFilename] = useState<{ value: boolean }>({
    value: false
  });
  const [confirmClear, setConfirmClear] = useState<{ value: boolean }>({
    value: false
  });

  const [showQueue, setShowQueue] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const menuContainerEl = useRef<HTMLDivElement>(null);
  const queueButtonRef = useRef<HTMLButtonElement>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);
  const queueSizeEl = useRef<HTMLSpanElement>(null);
  const autoQueueModeElRef = useRef<HTMLDivElement>(null);
  const loadFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const confirmClear = addSetting({
      id: 'Comfy.ConfirmClear',
      name: 'Require confirmation when clearing workflow',
      type: 'boolean',
      defaultValue: true,
      onChange: () => undefined
    });
    setConfirmClear(() => confirmClear);

    const promptFilename = addSetting({
      id: 'Comfy.PromptFilename',
      name: 'Prompt for filename when saving workflow',
      type: 'boolean',
      defaultValue: false,
      onChange: () => undefined
    });
    setPromptFilename(() => promptFilename);

    /* file format for preview
     *
     * format;quality
     *
     * ex)
     * webp;50 -> webp, quality 50
     * jpeg;80 -> rgb, jpeg, quality 80
     *
     * @type {string}
     */

    addSetting({
      id: 'Comfy.PreviewFormat',
      name: 'When displaying a preview in the image widget, convert it to a lightweight image, e.g. webp, jpeg, webp;50, etc.',
      type: 'text',
      defaultValue: '',
      onChange: () => {}
    });

    addSetting({
      id: 'Comfy.DisableSliders',
      name: 'Disable sliders.',
      type: 'boolean',
      defaultValue: false,
      onChange: () => undefined
    });

    addSetting({
      id: 'Comfy.DisableFloatRounding',
      name: 'Disable rounding floats (requires page reload).',
      type: 'boolean',
      defaultValue: false,
      onChange: () => undefined
    });

    addSetting({
      id: 'Comfy.FloatRoundingPrecision',
      name: 'Decimal places [0 = auto] (requires page reload).',
      type: 'slider',
      attrs: {
        min: 0,
        max: 6,
        step: 1
      },
      defaultValue: 0,
      onChange: () => undefined
    });

    // api.addEventListener('graphChanged', () => {
    //   if (autoQueueMode === 'change' && autoQueueEnabled) {
    //     if (lastQueueSize === 0) {
    //       setGraphHasChanged(false);
    //       submitWorkflow(0);
    //     } else {
    //       setGraphHasChanged(true);
    //     }
    //   }
    // });

    addSetting({
      id: 'Comfy.DevMode',
      name: 'Enable Dev mode Options',
      type: 'boolean',
      defaultValue: false,
      onChange: function (value: string) {
        const devSaveApiButton = document.getElementById('comfy-dev-save-api-button');
        if (devSaveApiButton) {
          devSaveApiButton.style.display = value ? 'block' : 'none';
        }
      }
    });
  }, []);

  const setStatus = (status: ComfyPromptStatus) => {
    if (!queueSizeEl.current) return;
    queueSizeEl.current.textContent =
      'Queue size: ' + (status ? status.exec_info.queue_remaining : 'ERR');

    if (status) {
      if (
        lastQueueSize != 0 &&
        status.exec_info.queue_remaining == 0 &&
        autoQueueEnabled &&
        (autoQueueMode === 'instant' || graphHasChanged) &&
        !lastExecutionError
      ) {
        submitWorkflow();
        status.exec_info.queue_remaining += batchCount;
        setGraphHasChanged(false);
      }
      setLastQueueSize(status.exec_info.queue_remaining);
    }
  };

  useEffect(() => {
    setStatus({ exec_info: { queue_remaining: 'X' } });
  }, [queueSizeEl]);

  useEffect(() => {
    if (menuContainerEl.current) {
      // dragElement(menuContainerEl.current, addSetting);
    }
  }, [menuContainerEl]);

  const autoQueueModeEl = toggleSwitch(
    'autoQueueMode',
    [
      {
        text: 'instant',
        tooltip: 'A new prompt will be queued as soon as the queue reaches 0'
      },
      {
        text: 'change',
        tooltip: 'A new prompt will be queued when the queue is at 0 and the graph is/has changed'
      }
    ],
    {
      ref: autoQueueModeElRef,
      onChange: (value: any) => {
        setAutoQueueMode(value.item.value);
      }
    }
  );

  if (autoQueueModeElRef.current) {
    autoQueueModeElRef.current.style.display = 'none';
  }

  const loadFileInput = (
    <input
      id="load-workflow"
      type="file"
      ref={loadFileInputRef}
      accept=".json,image/png,.latent,.safetensors,image/webp"
      style={{ display: 'none' }}
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const contents = e.target?.result;
            if (typeof contents === 'string') {
              const json = JSON.parse(contents);
              if (isLegacySerializedGraph(json)) {
                const graph = loadLegacyWorkflow(json, nodeDefs);
                loadSerializedGraph(graph);
              } else {
                loadSerializedGraph(json);
              }
            }
          };
          reader.readAsText(file);
        }
      }}
    />
  );

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 100 }}
      grid={[25, 25]}
      scale={1}
      //  onStart={this.handleStart}
      //  onDrag={this.handleDrag}
      //  onStop={this.handleStop}
    >
      <div className="control-panel">
        <div className="comfy-menu" ref={menuContainerEl}>
          {loadFileInput}

          <div
            className="drag-handle"
            style={{
              overflow: 'hidden',
              position: 'relative',
              cursor: 'default',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span className="drag-handle" />
            <span ref={queueSizeEl} />
            <button className="comfy-settings-btn" onClick={showSettings}>
              ⚙️
            </button>
          </div>

          <button id="queue-button" className="comfy-queue-btn" onClick={submitWorkflow}>
            Run All
          </button>

          <ExtraOptions
            setAutoQueueEnabled={setAutoQueueEnabled}
            setBatchCount={setBatchCount}
            batchCount={batchCount}
            autoQueueEnabled={autoQueueEnabled}
            autoQueueModeElRef={autoQueueModeElRef}
            autoQueueModeEl={autoQueueModeEl}
          />

          <div className="comfy-menu-btns">
            <button id="queue-front-button" onClick={submitWorkflow}>
              Queue Front
            </button>

            <button
              id="comfy-view-queue-button"
              ref={queueButtonRef}
              onClick={() => {
                setShowHistory(false);
                setShowQueue((i) => !i);
              }}
            >
              {showQueue ? 'Close' : 'View Queue'}
            </button>

            <button
              id="comfy-view-history-button"
              ref={historyButtonRef}
              onClick={() => {
                setShowQueue(false);
                setShowHistory((i) => !i);
              }}
            >
              {showHistory ? 'Close' : 'View History'}
            </button>
          </div>

          <ComfyList text="Queue" show={showQueue} />
          <ComfyList text="History" show={showHistory} reverse={true} />

          <button id="comfy-load-button" onClick={() => loadFileInputRef?.current?.click()}>
            Load
          </button>

          <SaveButton promptFilename={promptFilename} />
          <DevSaveButton promptFilename={promptFilename} />

          <button
            id="comfy-refresh-button"
            onClick={() => {
              /*app.refreshComboInNodes()*/
            }}
          >
            Refresh
          </button>

          <ClearButton confirmClear={confirmClear} />
          <LoadDefaultButton />
        </div>
      </div>
    </Draggable>
  );
};

export default ControlPanel;
