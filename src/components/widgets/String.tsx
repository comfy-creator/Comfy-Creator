type StringProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

export function String({ label, disabled, value, onChange }: StringProps) {
  return (
    <div className={'widget_box'}>
      <div className={'widget_input'}>
        <span>{label}</span>

        <span>{value}</span>
      </div>
    </div>
  );
}
