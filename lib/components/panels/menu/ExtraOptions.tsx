import React, { ReactNode, RefObject } from 'react';

interface ExtraOptionsProps {
  setAutoQueueEnabled: (i: boolean) => void;
  setBatchCount: (i: number) => void;
  batchCount: number;
  autoQueueEnabled: boolean;
  autoQueueModeElRef: RefObject<HTMLDivElement>;
  autoQueueModeEl: ReactNode;
}

const ExtraOptions = ({
  batchCount,
  setBatchCount,
  autoQueueEnabled,
  autoQueueModeEl,
  setAutoQueueEnabled,
  autoQueueModeElRef
}: ExtraOptionsProps) => {
  return (
    <>
      <div>
        <label>
          Extra Options
          <input
            type="checkbox"
            onChange={(i) => {
              let extraOptions = document.getElementById('extraOptions');
              if (extraOptions) {
                // extraOptions.style.display = i.srcElement.checked ? 'block' : 'none';
                extraOptions.style.display = i.target.checked ? 'block' : 'none';

                let batchCountInputRange = document.getElementById(
                  'batchCountInputRange'
                ) as HTMLInputElement;
                // this.batchCount = i.srcElement.checked ? Number(batchCountInputRange.value) : 1;
                setBatchCount(i.target.checked ? Number(batchCountInputRange.value) : 1);

                let autoQueueCheckbox = document.getElementById(
                  'autoQueueCheckbox'
                ) as HTMLInputElement;
                if (autoQueueCheckbox) {
                  autoQueueCheckbox.checked = false;
                }

                setAutoQueueEnabled(false);
              }
            }}
          />
        </label>
      </div>

      <div id="extraOptions" className='w-full hidden'>
        <div>
          <label>Batch Count</label>
          <input
            min={1}
            type="number"
            value={batchCount}
            id="batchCountInputNumber"
            className='w-[35%] ml-[0.4em]'
            onInput={(i) => {
              setBatchCount((i.target as any).value);
              let batchCountInputRange = document.getElementById(
                'batchCountInputRange'
              ) as HTMLInputElement | null;

              if (batchCountInputRange) {
                batchCountInputRange.value = batchCount.toString();
              }
            }}
          />

          <input
            type="range"
            min={1}
            max={100}
            value={batchCount}
            id="batchCountInputRange"
            onInput={(i) => {
              setBatchCount((i.target as any).value);
              let batchCountInputNumber = document.getElementById(
                'batchCountInputNumber'
              ) as HTMLInputElement | null;
              if (batchCountInputNumber) {
                batchCountInputNumber.value = (i.target as any).value;
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="autoQueueCheckbox">Auto Queue</label>
          <input
            id="autoQueueCheckbox"
            type="checkbox"
            checked={autoQueueEnabled}
            title="Automatically queue prompt when the queue size hits 0"
            onChange={(e) => {
              setAutoQueueEnabled(e.target.checked);
              if (autoQueueModeElRef.current) {
                autoQueueModeElRef.current.style.display = autoQueueEnabled ? '' : 'none';
              }
            }}
          />
          {autoQueueModeEl}
        </div>
      </div>
    </>
  );
};

export default ExtraOptions;