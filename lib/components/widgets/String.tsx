import { InputDialog } from '../dialogs/InputDialog';
import { ChangeEvent, useState } from 'react';

type StringProps = {
  label: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export function StringWidget({ disabled, label, value, onChange }: StringProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const disabledClass = disabled ? 'widget_input_item_disabled' : '';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="widget_box">
      <div className="widget_input" onClick={() => setShowDialog(true)}>
        <div className={`widget_input_item ${disabledClass}`}>
          <div>{label}</div>
        </div>

        <div className={`widget_input_item ${disabledClass}`}>
          <div>{inputValue}</div>
        </div>
      </div>

      {showDialog && !disabled && (
        <InputDialog
          value={inputValue}
          onChange={handleInputChange}
          hideDialog={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
