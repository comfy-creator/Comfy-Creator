import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextWidgetProps {
  label: string;
}

export const TextWidget = ({ label }: TextWidgetProps) => {
  return (
    <div>
      <Label className="text-[12px] font-medium">{label}</Label>



      <Textarea
        className="min-h-[60.57px] p-2 rounded-none h-12 overflow-hidden text-[.75rem] opacity-90"
        placeholder={label}
      />
    </div>
  );
};
