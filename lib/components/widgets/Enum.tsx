import { useEffect, useState } from 'react';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../icons/WidgetDirectionIcon';

type EnumProps = {
  label: string;
  value: string;
  disabled?: boolean;
  options: { values: string[] | (() => string[]) };
  onChange?: (value: string) => void;
  multiSelect?: boolean;
};

export function EnumWidget({ label, disabled, value, options, onChange, multiSelect }: EnumProps) {
  const [valueIndex, setValueIndex] = useState<number | null>(null);
  const [enumOptions, setEnumOptions] = useState<string[]>([]);

  const getEnumOptions = () => {
    const values: string[] = [];

    if (Array.isArray(options.values)) {
      values.push(...options.values);
    } else {
      const result = options.values();
      Array.isArray(result) ? values.push(...result) : values.push(result);
    }

    return values;
  };

  useEffect(() => {
    const opts = getEnumOptions();
    const valueIndex = opts.indexOf(value);

    if (valueIndex !== -1) {
      setValueIndex(valueIndex);
    } else {
      console.warn(`EnumWidget: value "${value}" is not in the list of options`);
    }

    setEnumOptions(opts);
  }, []);

  useEffect(() => {
    if (valueIndex == undefined) return;
    const value = enumOptions[valueIndex];

    setValueIndex(valueIndex);
    onChange?.(value);
  }, [valueIndex]);

  const handleForward = () => {
    if (disabled) return;
    setValueIndex((i) => {
      if (i == undefined) return 0;
      return i === enumOptions.length - 1 ? 0 : i + 1;
    });
  };

  const handleBackward = () => {
    if (disabled) return;

    setValueIndex((i) => {
      if (i == undefined) return 0;
      return i === 0 ? enumOptions.length - 1 : i - 1;
    });
  };

  const disabledClass = disabled ? 'widget_input_item_disabled' : '';

  return (
    <div className="widget_box">
      <div className="widget_input">
        <div className="widget_input_item">
          <WidgetBackwardIcon disabled={disabled} onClick={handleBackward} />
          <div className={`widget_input_item_text ${disabledClass}`}>{label}</div>
        </div>

        <div className="widget_input_item" style={{ gap: '5px' }}>
          <span className={`widget_input_item_text ${disabledClass}`}>
            {valueIndex != undefined ? enumOptions[valueIndex] : 'undefined'}
          </span>
          <WidgetForwardIcon disabled={disabled} onClick={handleForward} />
        </div>
      </div>
    </div>
  );
}
