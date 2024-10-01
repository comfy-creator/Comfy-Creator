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
      <div className="graphdialog rounded">
         <span className="name">Value</span>
         <input autoFocus type="text" value={value} className="value" onChange={onChange} />
         <Button className="rounded" variant="bordered" onClick={hideDialog}>
            OK
         </Button>
      </div>
   );
}
