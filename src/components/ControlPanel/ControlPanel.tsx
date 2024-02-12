import { useRef, useState, ReactNode, useEffect } from "react";
import Draggable from "react-draggable";
import { useSettings } from "../../contexts/settingsContext";
import { usePrompt } from "../../hooks/usePrompt";
import Button from "../Button";
import ExtraOptions from "./menu/ExtraOptions";
import SaveButton from "./menu/SaveButton";
import DevSaveButton from "./menu/DevSaveButton";
import ClearButton from "./menu/ClearButton";
import LoadDefaultButton from "./menu/LoadDefaultButton";
import { ComfyPromptStatus } from "../../types/comfy";
import { toggleSwitch } from "../../utils/ui";
import { ComfyList } from "../ComfyList";

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
  const { queuePrompt, graphToPrompt } = usePrompt();
  // const { lastExecutionError } = useComfyApp();
  const lastExecutionError = false;

  const [batchCount, setBatchCount] = useState(1);
  const [lastQueueSize, setLastQueueSize] = useState(0);
  const [queueList, setQueueList] = useState<ReactNode>([]);
  const [historyList, setHistoryList] = useState<ReactNode>([]);
  const [autoQueueMode, setAutoQueueMode] = useState<AutoQueueMode>(null);
  const [graphHasChanged, setGraphHasChanged] = useState(false);
  const [autoQueueEnabled, setAutoQueueEnabled] = useState(false);
  const [confirmClear, setConfirmClear] = useState<{ value: boolean }>({
    value: false,
  });
  const [promptFilename, setPromptFilename] = useState<{ value: boolean }>({
    value: false,
  });

  const [showQueue, setShowQueue] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const menuContainerEl = useRef<HTMLDivElement>(null);
  const queueButtonRef = useRef<HTMLButtonElement>(null);
  const historyButtonRef = useRef<HTMLButtonElement>(null);
  const queueSizeEl = useRef<HTMLSpanElement>(null);
  const autoQueueModeElRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setStatus = (status: ComfyPromptStatus) => {
    if (!queueSizeEl.current) return;
    queueSizeEl.current.textContent =
      "Queue size: " + (status ? status.exec_info.queue_remaining : "ERR");

    if (status) {
      if (
        lastQueueSize != 0 &&
        status.exec_info.queue_remaining == 0 &&
        autoQueueEnabled &&
        (autoQueueMode === "instant" || graphHasChanged) &&
        !lastExecutionError
      ) {
        queuePrompt(0);
        status.exec_info.queue_remaining += batchCount;
        setGraphHasChanged(false);
      }
      setLastQueueSize(status.exec_info.queue_remaining);
    }
  };

  useEffect(() => {
    setStatus({ exec_info: { queue_remaining: "X" } });
  }, [queueSizeEl]);

  useEffect(() => {
    if (menuContainerEl.current) {
      // dragElement(menuContainerEl.current, addSetting);
    }
  }, [menuContainerEl]);

  const autoQueueModeEl = toggleSwitch(
    "autoQueueMode",
    [
      {
        text: "instant",
        tooltip: "A new prompt will be queued as soon as the queue reaches 0",
      },
      {
        text: "change",
        tooltip:
          "A new prompt will be queued when the queue is at 0 and the graph is/has changed",
      },
    ],
    {
      ref: autoQueueModeElRef,
      onChange: (value: any) => {
        setAutoQueueMode(value.item.value);
      },
    }
  );

  if (autoQueueModeElRef.current) {
    autoQueueModeElRef.current.style.display = "none";
  }

  const fileInput = (
    <input
      id="comfy-file-input"
      type="file"
      ref={fileInputRef}
      accept=".json,image/png,.latent,.safetensors,image/webp"
      style={{ display: "none" }}
      onChange={() => {
        if ("files" in fileInput && Array.isArray(fileInput.files)) {
          // app.handleFile(fileInput.files[0]);
        }
      }}
    />
  );

  return (
    <Draggable
      //   axis="x"
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 100 }}
      //   position={null}
      grid={[25, 25]}
      scale={1}
      //  onStart={this.handleStart}
      //  onDrag={this.handleDrag}
      //  onStop={this.handleStop}
    >
      <div className="control-panel handle">
        <div className="comfy-menu" ref={menuContainerEl}>
          {fileInput}
          <div
            className="drag-handle"
            style={{
              overflow: "hidden",
              position: "relative",
              cursor: "default",
              width: "100%",
            }}
          >
            <span className="drag-handle" />
            <span ref={queueSizeEl} />
            <button className="comfy-settings-btn" onClick={showSettings}>
              ⚙️
            </button>
          </div>

          <button
            id="queue-button"
            className="comfy-queue-btn"
            onClick={() => queuePrompt(0)}
          >
            Queue Prompt
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
            <button id="queue-front-button" onClick={() => queuePrompt(-1)}>
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
              {showQueue ? "Close" : "View Queue"}
            </button>

            <button
              id="comfy-view-history-button"
              ref={historyButtonRef}
              onClick={() => {
                setShowQueue(false);
                setShowHistory((i) => !i);
              }}
            >
              {showHistory ? "Close" : "View History"}
            </button>
          </div>

          <ComfyList text="Queue" show={showQueue} />
          <ComfyList text="History" show={showHistory} reverse={true} />

          <button
            id="comfy-load-button"
            onClick={() => fileInputRef?.current?.click?.()}
          >
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
          <LoadDefaultButton confirmClear={confirmClear} />
        </div>
      </div>
    </Draggable>
  );
};

export default ControlPanel;
