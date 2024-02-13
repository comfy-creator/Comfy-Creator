import { TextWidget } from "../../types.ts";

export function Text({ label, name, disabled, value, onChange }: TextWidget) {
  return (
    <>
      <label>{label || name}</label>
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
