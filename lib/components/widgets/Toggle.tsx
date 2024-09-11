import { Checkbox } from '@/components/ui/checkbox';
import { FC, useEffect, useState } from 'react';

type ToggleProps = {
   label: string;
   checked: boolean;
   disabled?: boolean;
   onChange: (checked: boolean) => void;
};

export const ToggleWidget: FC<ToggleProps> = ({ label, disabled, checked, onChange }) => {
   const [input, setInput] = useState(checked);
   const disabledClass = disabled ? 'widget_input_item_disabled' : '';

   useEffect(() => {
      setInput(input);
      onChange?.(input);
   }, [input]);

   const handleToggle = () => {
      if (disabled) return;
      setInput((inp) => !inp);
   };

   return (
      <div
         className="widget_box mt-[4px]"
         style={{
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            top: '2px',
            opacity: disabled ? 0.5 : 1,
            width: '100%'
         }}
      >
         <div
            className="widget_input_item"
            onClick={handleToggle}
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

            {/* <input
                  type="radio"
                  checked={input}
                  onChange={(e) => setInput(e.target.checked)}
                  style={{ background: 'none', accentColor: '#76b900', margin: 0 }}
               /> */}
            <div className="flex !bg-bg hover:!bg-bg items-center justify-between !w-full data-[hover=true]:!bg-bg px-3 py-1.5 rounded-full">
               <p className="text-dragText text-[10px]">{input ? 'True' : 'False'}</p>
               <Checkbox
                  checked={input}
                  onCheckedChange={(checked) => setInput(checked === true)}
                  className="rounded-full"
                  aria-setsize={10}
               />
            </div>
         </div>
      </div>
   );
};
