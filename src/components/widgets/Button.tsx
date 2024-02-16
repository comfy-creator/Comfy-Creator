import { ButtonWidget } from '../../types.ts';

//  y?: number;
//   last_y: number;
//   disabled?: boolean;
//   width?: number;
//   clicked?: boolean;
//   value?: any;
//   options?: any;
//   marker?: any;

export function Button({ disabled, label, onClick }: ButtonWidget) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
