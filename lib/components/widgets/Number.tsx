import { ChangeEvent, FC, useEffect, useState } from 'react';
import { InputDialog } from '../dialogs/InputDialog';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../icons/WidgetDirectionIcon.tsx';

type NumberWidgetProps = {
  value?: number;
  label: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
};

export const NumberWidget: FC<NumberWidgetProps> = ({ label, value = 0, onChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setInputValue(inputValue);
    onChange?.(inputValue);
  }, [inputValue]);

  const handleClickForward = () => {
    setInputValue((value) => {
      return isNaN(value) ? 0 : value + 1;
    });
  };

  const handleClickBackward = () => {
    setInputValue((value) => {
      return isNaN(value) ? 0 : value > 0 ? value - 1 : value;
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    setInputValue(value);
  };

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  return (
    <div className="widget_box">
      <div className="widget_input">
        <div className="widget_input_item">
          <WidgetBackwardIcon onClick={handleClickBackward} />
          <span className="widget_input_item_text" onClick={handleShowDialog}>
            {label}
          </span>
        </div>

        <div className="widget_input_item">
          <span className="widget_input_item_text" onClick={handleShowDialog}>
            {inputValue}
          </span>
          <WidgetForwardIcon onClick={handleClickForward} />
        </div>
      </div>

      {showDialog && (
        <InputDialog
          onChange={handleInputChange}
          value={String(inputValue)}
          hideDialog={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};
