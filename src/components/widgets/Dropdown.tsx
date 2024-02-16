import { DropdownWidget } from '../../types';

export function Dropdown({ label, disabled, value, options, onChange }: DropdownWidget) {
  const values = options
    ? Array.isArray(options.values)
      ? options.values
      : options.values()
    : value;

  return (
    <>
      <label>{label}</label>
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
