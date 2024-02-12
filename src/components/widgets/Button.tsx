import { ButtonWidget } from "../../types.ts";

//  y?: number;
//   last_y: number;
//   disabled?: boolean;
//   width?: number;
//   clicked?: boolean;
//   value?: any;
//   options?: any;
//   marker?: any;

export function Button({ type, disabled, label, name, onClick }: ButtonWidget) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
      }}
    >
      {label || name}
    </button>
  );
}
