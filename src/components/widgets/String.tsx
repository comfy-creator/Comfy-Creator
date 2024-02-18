type StringProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function String({ label, disabled, value, onChange }: StringProps) {
  return (
    <>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      />
    </>
  );
}
