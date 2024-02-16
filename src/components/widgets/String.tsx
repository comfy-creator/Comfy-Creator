import { StringWidget } from '../../types.ts';

export function String({ label, disabled, value, onChange }: StringWidget) {
  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e);
        }}
      />
    </>
  );
}
