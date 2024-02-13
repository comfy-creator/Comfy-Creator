import { ComboWidget } from "../../types.ts";

export function Combo({
  label,
  name,
  disabled,
  value,
  options,
  onChange,
}: ComboWidget) {
  const values = options
    ? Array.isArray(options.values)
      ? options.values
      : options.values()
    : value;

  return (
    <>
      <label>{label || name}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e);
        }}
      >
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
}
