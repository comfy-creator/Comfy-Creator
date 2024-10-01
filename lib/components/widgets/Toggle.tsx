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
            className=" flex text-[#b2b2b2] mx-[5px] text-[0.6rem] items-start justify-center cursor-pointer w-full flex-col !mx-auto">
            <p className={`widget_input_item_text ${disabledClass}`}>{label}</p>

  
            <div className="flex !bg-[#3B3B3B] hover:!bg-[#3B3B3B] items-center justify-between !w-full data-[hover=true]:!bg-[#3B3B3B] px-3 py-1.5 rounded-full"
            
           
               onClick={handleToggle}
            >
               <p className="text-dragText text-[10px]">{input ? 'True' : 'False'}</p>



               
               <div
                  className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out ${
                     input ? 'bg-green-500' : 'bg-red-500'
                  }`}
                 
               >
                  <div
                     className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        input ? 'translate-x-4' : 'translate-x-0'
                     }`}
                  ></div>
               </div>


            </div>
         </div>
      </div>
   );
};
