import { ToggleWidget } from '../../types.ts';

export function Toggle({ label, options, disabled, value, onChange }: ToggleWidget) {
  return (
    <>
      <label>{label}</label>
      <input
        checked={value}
        type="checkbox"
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e);
        }}
      />{' '}
      {value ? options?.on || 'true' : options?.off || 'false'}
    </>
  );
}
