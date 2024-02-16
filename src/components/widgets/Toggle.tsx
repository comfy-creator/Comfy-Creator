import React, { useState } from 'react';
import { BoolInput, ToggleWidget, ComponentProps } from '../../types';

export function Toggle({ label, defaultValue, disabled, onChange }: BoolInput & ComponentProps) {
  // Initialize state with defaultValue
  const [checked, setChecked] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked); // Update internal state
    onChange?.(e); // Call external onChange handler if provided
  };

  return (
    <>
      <label>{label}</label>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={handleChange} />{' '}
      {/* {checked ? options?.on || 'true' : options?.off || 'false'} */}
    </>
  );
}
