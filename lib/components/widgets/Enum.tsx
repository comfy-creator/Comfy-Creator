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

  const handleForward = () =>
    setValueIndex((i) => {
      if (i == undefined) return 0;
      return i === enumOptions.length - 1 ? 0 : i + 1;
    });

  const handleBackward = () =>
    setValueIndex((i) => {
      if (i == undefined) return 0;
      return i === 0 ? enumOptions.length - 1 : i - 1;
    });

  return (
    <div className="widget_box">
      <div className="widget_input">
        <div className="widget_input_item">
          <WidgetBackwardIcon onClick={handleBackward} />
          <span className="widget_input_item_text">{label}</span>
        </div>

        <div className="widget_input_item" style={{ gap: '5px' }}>
          <span className="widget_input_item_text">
            {valueIndex != undefined ? enumOptions[valueIndex] : 'undefined'}
          </span>
          <WidgetForwardIcon onClick={handleForward} />
        </div>
      </div>
    </div>
  );
}
