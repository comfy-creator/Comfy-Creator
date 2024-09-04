import { Box } from '@mui/material';
import { Checkbox, cn, Radio } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';
// import { Checkbox } from 'antd';

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
         className="widget_box"
         style={{
            alignItems: 'center',
            cursor: 'pointer',
            margin: '.67rem 0',
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
            <Checkbox
               isSelected={input}
               onValueChange={(checked) => setInput(checked)}
               className="w-full h-[15px]"
               classNames={{
                  base: cn(
                     'inline-flex m-0 !bg-bg hover:!bg-bg items-center justify-between',
                     'flex-row-reverse max-w-[100%] cursor-pointer rounded-xl p-4 border border-transparent',
                     'data-[selected=true]:border-primary bg-bg'
                  )
               }}
            >
               <p className="text-fg text-[11px] mr-5">{input ? 'True' : 'False'}</p>
            </Checkbox>
         </div>
      </div>
   );
};
