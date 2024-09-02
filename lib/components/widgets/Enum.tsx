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
            <select
               onChange={(e) => handleSelect(e.target.value)}
               value={value}
               className="dropdown"
            >
               {options.map((option) => (
                  <option key={option} value={option}>
                     {option}
                  </option>
               ))}
            </select>
         </div>
      </div>
   );
}
