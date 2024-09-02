import { FC, useEffect, useState } from 'react';
import { Checkbox } from 'antd';

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
      <div className="widget_box">
         <div className="widget_input">
            <div className="widget_input_item" onClick={handleToggle}>
               <span className={`widget_input_item_text ${disabledClass}`}>{label}</span>
               <Checkbox checked={input} onChange={(e) => setInput(e.target.checked)} />
            </div>
         </div>
      </div>
   );
};
