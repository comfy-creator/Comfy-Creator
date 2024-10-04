import { Button } from '@nextui-org/react';
import { ChangeEvent } from 'react';

interface InputDialogProps {
   value?: string;
   hideDialog: () => void;
   position?: { x: number; y: number };
   onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputDialog({ hideDialog, value, onChange }: InputDialogProps) {
   return (
      <div className="absolute top-[10px] left-[10px] min-h-[1em] bg-comfy-menu-bg text-[1.2em] shadow-[0_0_10px_black] z-[10] rounded-[12px] pr-[2px]">
         <span className="text-[18px] font-sans text-descripText inline-block min-w-[60px] min-h-[1.5em] pl-[5px] pr-[10px]">
            Value
         </span>
         <input
            autoFocus
            type="text"
            value={value}
            className="mt-[3px] min-w-[60px] min-h-[1.5em] bg-comfyInputBg text-inputText pl-[10px] mr-[5px] max-w-[300px] border-2 border-borderColor rounded-[12px] focus:outline-none"
            onChange={onChange}
         />
         <Button className="rounded" variant="bordered" onClick={hideDialog}>
            OK
         </Button>
      </div>
   );
}