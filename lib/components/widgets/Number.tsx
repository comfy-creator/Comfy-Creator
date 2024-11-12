import { ChangeEvent, FC, useEffect, useState } from 'react';
import { InputDialog } from '../dialogs/InputDialog';
import { Slider } from '../../components/ui/slider';

type NumberWidgetProps = {
   value?: number;
   label: string;
   disabled?: boolean;
   onChange?: (value: number) => void;
};

export const NumberWidget: FC<NumberWidgetProps> = ({ label, disabled, value = 65, onChange }) => {
   const [inputValue, setInputValue] = useState(value);
   const [showDialog, setShowDialog] = useState(false);

   useEffect(() => {
      setInputValue(inputValue);
      onChange?.(inputValue);
   }, [inputValue]);

   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const value = Number(e.target.value);
      if (isNaN(value)) return;
      setInputValue(value);
   };

   const handleShowDialog = () => {
      setShowDialog(true);
   };

   const disabledClass = disabled ? 'widget_input_item_disabled' : '';

   return (
      <div className="flex flex-col mt-[6px]">
         <div>
            <div className="flex items-center justify-between mb-2 text-[9px]">
               <p className={` ${disabledClass}`}>{label}</p>
               <p onClick={handleShowDialog}>{value}</p>
            </div>
            <Slider
               step={1}
               max={100}
               min={0}
               aria-label={label}
               defaultValue={[65]}
               className="max-w-md"
               onValueChange={(number) => onChange?.(number[0])}
            />
         </div>

      
         {showDialog && (
            <InputDialog
               onChange={handleInputChange}
               value={String(inputValue)}
               hideDialog={() => setShowDialog(false)}
            />
         )}
      </div>
   );
};
