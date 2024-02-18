import React, { useState } from 'react';

type ToggleProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ label, checked, disabled, onChange }: ToggleProps) {
  // Update state in the parent component
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <>
      <label>{label}</label>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={handleChange} />
    </>
  );
}
