import { useEffect, useState } from 'react';
import { WidgetBackwardIcon, WidgetForwardIcon } from '../icons/WidgetDirectionIcon';
import { Select, SelectItem } from '@nextui-org/react';

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
      <div
         style={{
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            top: '2px',
            opacity: disabled ? 0.5 : 1,
            width: '100%'
         }}
         className="widget_box mt-[4px]"
      >
         <div
            className="widget_input_item"
            style={{
               alignItems: 'start',
               cursor: 'pointer',
               marginLeft: 0,
               flexDirection: 'column',
               justifyContent: 'center !important',
               gap: '0px !important',
               width: '100%'
            }}
         >
            <p className={`widget_input_item_text ${disabledClass}`}>{label}</p>
            <Select
               placeholder="Select a feature"
               onChange={(e) => handleSelect(e.target.value)}
               value={value}
               classNames={{
                  label: 'group-data-[filled=true]:-translate-y-5',
                  trigger:
                     '!min-h-[27px] !h-[20px] w-full !text-[10px] !text-dragText bg-bg hover:!bg-bg',
                  listboxWrapper: 'max-h-[400px]',
                  innerWrapper: '!h-[20px] !text-dragText',
                  value: '!text-dragText !text-[10px]'
               }}
               listboxProps={{
                  itemClasses: {
                     base: [
                        'rounded-md',
                        'text-default-500',
                        'transition-opacity',
                        'data-[hover=true]:text-fg',
                        'data-[hover=true]:bg-default-100',
                        'dark:data-[hover=true]:bg-default-50',
                        'data-[selectable=true]:focus:bg-default-50',
                        'data-[pressed=true]:opacity-70',
                        'data-[focus-visible=true]:ring-default-500'
                     ]
                  }
               }}
               popoverProps={{
                  classNames: {
                     base: 'before:bg-default-200',
                     content: 'p-0 border-small border-divider bg-bg text-fg'
                  }
               }}
            >
               {options.map((option) => (
                  <SelectItem key={option} value={option}>
                     {option}
                  </SelectItem>
               ))}
            </Select>
         </div>
      </div>
   );
}
