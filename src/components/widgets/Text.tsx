type TextWidgetProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export function Text({ label, disabled, value, onChange }: TextWidgetProps) {
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
