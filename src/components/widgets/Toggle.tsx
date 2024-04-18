import { FC, useEffect, useState } from 'react';

type ToggleProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export const ToggleWidget: FC<ToggleProps> = ({ label, disabled, checked, onChange }) => {
  const [input, setInput] = useState(checked);

  useEffect(() => {
    setInput(input);
    onChange?.(input);
  }, [input]);

  const handleToggle = () => {
    setInput((inp) => !inp);
  };

  const ToggleCircle = () => {
    return (
      <div
        style={{
          width: '8px',
          height: '8px',
          marginLeft: '1px',
          marginRight: '3px',
          borderRadius: '50%',
          background: `${input ? '#606f79' : '#363636'}`
        }}
      />
    );
  };

  return (
    <div className={'widget_box'}>
      <div className={'widget_input'}>
        <div className={'widget_input_item'} onClick={handleToggle}>
          <span className={'widget_input_item_text'}>{String(input)}</span>
          <ToggleCircle />
        </div>
      </div>
    </div>
  );
};
