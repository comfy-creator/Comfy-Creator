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
         }}
      >
         <div
            className="widget_input_item"
            onClick={handleToggle}
            style={{
               alignItems: 'center',
               cursor: 'pointer',
               marginLeft: 0,
              
            }}
         >
            <span className={`widget_input_item_text ${disabledClass}`}>{label}</span>
            <input type="radio" checked={input} onChange={(e) => setInput(e.target.checked)} style={{background: 'none'}} />
         </div>
      </div>
   );
};
