import { useEffect, useState } from 'react';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../WidgetDirectionIcon.tsx';

type NumberWidgetProps = {
  label: string;
  disabled?: boolean;
  value: number;
  onChange?: (value: number) => void;
};

export const Number: React.FC<NumberWidgetProps> = ({ label, disabled, value, onChange }) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(input);
  }, [input]);

  const handleForward = () => {
    const inputValue = parseInt(String(input));
    setInput(isNaN(inputValue) ? 0 : inputValue + 1);
  };

  const handleBackward = () => {
    const inputValue = parseInt(String(input));
    if (isNaN(inputValue)) {
      setInput(0);
    } else if (inputValue > 0) {
      setInput(input - 1);
    }
  };

  return (
    <div className={'widget_box'}>
      <div className={'widget_input'}>
        <div className={'widget_input_item'}>
          <WidgetBackwardIcon onClick={handleBackward} />
          <span className={'widget_input_item_text'}>{label}</span>
        </div>

        <div className={'widget_input_item'} style={{ gap: '5px' }}>
          <span className={'widget_input_item_text'}>{input}</span>
          <WidgetForwardIcon onClick={handleForward} />
        </div>
      </div>
    </div>
  );
};
