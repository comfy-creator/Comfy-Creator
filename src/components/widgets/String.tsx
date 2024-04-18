import { InputDialog } from '../dialogs/InputDialog.tsx';
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
    <div className={'widget_box'}>
      <div
        style={{ padding: '2px 5px' }}
        className={'widget_input'}
        onClick={() => setShowDialog(true)}
      >
        <span>{inputValue}</span>
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
