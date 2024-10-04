import {
   SelectContent,
   SelectTrigger,
   SelectValue,
   SelectItem,
   Select
} from '@/components/ui/select';

type EnumProps = {
   label: string;
   value: string;
   disabled?: boolean;
   options: string[];
   onChange?: (value: string) => void;
   multiSelect?: boolean;
};

export function EnumWidget({ label, disabled, value, options, onChange, multiSelect }: EnumProps) {

   const handleSelect = (value: string) => {
      if (onChange) {
         onChange(value);
      }
   };

   return (
      <div
         className={`w-full mt-[4px] relative top-[2px] flex items-center justify-between cursor-pointer ${disabled ? "opacity-50" : "opacity-100"}`}
      >
         <div
            className="w-full flex cursor-pointer m-0 flex-col items-start justify-center gap-0 text-[#b2b2b2] text-[0.6rem]"
			>
            <p className={`${disabled && "text-[#656565]"}`}>{label}</p>
            <Select>
               <SelectTrigger className="!w-full !text-[10px] p-2 h-[25px] !bg-bg border-none outline-none focus:ring-borderColor">
                  <SelectValue placeholder="Select a feature" />
               </SelectTrigger>
               <SelectContent className="!bg-bgk border-none cursor-pointer">
                  {options.map((option) => (
                     <SelectItem className="!text-xs text-fg cursor-pointer" key={option} value={option}>
                        {option}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            
         </div>
      </div>
   );
}