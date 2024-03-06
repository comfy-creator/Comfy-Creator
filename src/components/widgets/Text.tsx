import { useEffect, useState } from 'react';

type TextProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function TextWidget({ disabled, value, onChange }: TextProps) {
  const [inputValue, setInputValue] = useState(value);
  return (
    <textarea
      rows={4}
      value={inputValue}
      disabled={disabled}
      className={'comfy-multiline-input'}
      style={{ width: '100%', outline: 'none' }}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange?.(e.target.value);
      }}
    />
  );
}
