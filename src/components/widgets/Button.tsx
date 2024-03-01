type ButtonProps = {
  disabled?: boolean;
  label: string;
  onClick?: () => void;
};

export function Button({ disabled, label, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
