import { InputDialog } from '../dialogs/InputDialog';
import { ChangeEvent, useState } from 'react';

type StringProps = {
  label: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export function StringWidget({ label, value, onChange }: StringProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="widget_box">
      <div className="widget_input" onClick={() => setShowDialog(true)}>
        <div className="widget_input_item">
          <div>{label}</div>
        </div>

        <div className="widget_input_item">
          <div>{inputValue}</div>
        </div>
      </div>

      {showDialog && (
        <InputDialog
          value={inputValue}
          onChange={handleInputChange}
          hideDialog={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
