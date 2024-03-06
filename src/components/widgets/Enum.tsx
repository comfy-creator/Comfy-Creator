import { useEffect, useState } from 'react';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../WidgetDirectionIcon.tsx';
import { EnumDialog } from '../dialogs/EnumDialog.tsx';

type EnumProps = {
  label: string;
  disabled?: boolean;
  value: string | string[];
  options: { values: string[] | (() => string[]) };
  onChange?: (value: string | string[]) => void;
  multiSelect?: boolean;
};

export function EnumWidget({ label, disabled, value, options, onChange, multiSelect }: EnumProps) {
  const values = options
    ? Array.isArray(options.values)
      ? options.values
      : options.values()
    : typeof value === 'string'
      ? [value]
      : value;

  const [input, setInput] = useState(0);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setInput(input);
    onChange?.(values[input]);
  }, [input]);

  const handleInputIncrement = () => {
    setInput((i) => (i === values.length - 1 ? 0 : i + 1));
  };

  const handleBackward = () => {
    setInput((i) => (i === 0 ? values.length - 1 : i - 1));
  };

  return (
    <div className={'widget_box'}>
      <div className={'widget_input'}>
        <div className={'widget_input_item'}>
          <WidgetBackwardIcon onClick={handleBackward} />
          <span className={'widget_input_item_text'}>{label}</span>
        </div>

        <div className={'widget_input_item'} style={{ gap: '5px' }}>
          <span className={'widget_input_item_text'}>{values[input]}</span>
          <WidgetForwardIcon onClick={handleInputIncrement} />
        </div>
      </div>

      {showDialog && <EnumDialog />}
    </div>
  );
}
