import { TextWidget } from '../../types.ts';

export function Text({ label, disabled, value, onChange }: TextWidget) {
  return (
    <>
      <label>{label}</label>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e);
        }}
      />
    </>
  );
}
