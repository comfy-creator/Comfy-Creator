import { StringWidget } from "../../types.ts";

export function String({
  label,
  name,
  disabled,
  value,
  onChange,
}: StringWidget) {
  return (
    <>
      <label>{label || name}</label>
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
