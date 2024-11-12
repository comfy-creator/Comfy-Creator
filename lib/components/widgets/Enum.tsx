import {
   SelectContent,
   SelectTrigger,
   SelectValue,
   SelectItem,
   Select
} from '../../components/ui/select';

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

   const disabledClass = disabled ? 'widget_input_item_disabled' : '';

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
               marginRight: 0,
               flexDirection: 'column',
               justifyContent: 'center !important',
               gap: '0px !important',
               width: '100%'
            }}
         >
            <p className={`widget_input_item_text ${disabledClass}`}>{label}</p>
            <Select>
               <SelectTrigger className="!w-full !text-[10px] p-2 h-[25px] bg-[#3B3B3B] border-none outline-none focus:ring-borderColor">
                  <SelectValue placeholder="Select a feature" />
               </SelectTrigger>
               <SelectContent className="bg-[#3B3B3B] border-none cursor-pointer">
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
