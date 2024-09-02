import { useEffect, useState } from 'react';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../icons/WidgetDirectionIcon';
import { Select } from 'antd';

type EnumProps = {
   label: string;
   value: string;
   disabled?: boolean;
   options: string[];
   onChange?: (value: string) => void;
   multiSelect?: boolean;
};

export function EnumWidget({ label, disabled, value, options, onChange, multiSelect }: EnumProps) {
   const [valueIndex, setValueIndex] = useState<number | null>(null);

   const handleSelect = (value: string) => {
      if (onChange) {
         onChange(value);
      }
   };

   const disabledClass = disabled ? 'widget_input_item_disabled' : '';
   console.log('options', options);
   return (
      <div className="widget_box">
         <div className="widget_input">
            {/* <div className="widget_input_item">
          <WidgetBackwardIcon disabled={disabled} onClick={handleBackward} />
          <div className={`widget_input_item_text ${disabledClass}`}>{label}</div>
        </div>

        <div className="widget_input_item" style={{ gap: '5px' }}>
          <span className={`widget_input_item_text ${disabledClass}`}>
            {valueIndex != undefined ? enumOptions[valueIndex] : 'undefined'}
          </span>
          <WidgetForwardIcon disabled={disabled} onClick={handleForward} />
        </div> */}

            <Select
               onChange={handleSelect}
               value={value}
               style={{ width: '100%' }}
            >
               {options.map((option) => (
                  <Select.Option key={option} value={option}>
                     {option}
                  </Select.Option>
               ))}
            </Select>
         </div>
      </div>
   );
}
