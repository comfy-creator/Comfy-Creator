import { ChangeEvent } from 'react';

interface InputDialogProps {
  value: string;
  hideDialog: () => void;
  position?: { x: number; y: number };
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputDialog({ hideDialog, value, onChange }: InputDialogProps) {
  return (
    <div className="graphdialog rounded">
      <span className="name">Value</span>
      <input autoFocus type="text" value={value} className="value" onChange={onChange} />
      <button className="rounded" onClick={hideDialog}>
        OK
      </button>
    </div>
  );
}
