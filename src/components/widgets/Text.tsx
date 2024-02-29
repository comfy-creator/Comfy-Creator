type TextProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function Text({ label, disabled, value, onChange }: TextProps) {
  return (
    <>
      <textarea
        style={{ width: '100%', outline: 'none' }}
        className={'comfy-multiline-input'}
        value={value}
        disabled={disabled}
        rows={4}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      ></textarea>
    </>
  );
}
