type DropdownProps = {
  label: string;
  disabled?: boolean;
  value: string | string[];
  options: { values: string[] | (() => string[]) };
  onChange?: (value: string | string[]) => void;
  multiSelect?: boolean;
};

export function Dropdown({
  label,
  disabled,
  value,
  options,
  onChange,
  multiSelect
}: DropdownProps) {
  const values = options
    ? Array.isArray(options.values)
      ? options.values
      : options.values()
    : typeof value === 'string'
      ? [value]
      : value;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiSelect) {
      const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
      onChange?.(selectedOptions);
    } else {
      onChange?.(e.target.value);
    }
  };

  return (
    <>
      <label>{label}</label>
      <select value={value} disabled={disabled} onChange={handleChange} multiple={multiSelect}>
        {values.map((v) => (
          <option key={v} value={v} selected={Array.isArray(value) ? value.includes(v) : undefined}>
            {v}
          </option>
        ))}
      </select>
    </>
  );
}
