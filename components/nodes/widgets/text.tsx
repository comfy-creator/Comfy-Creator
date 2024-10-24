import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextWidgetProps {
  label: string;
}

export const TextWidget = ({ label }: TextWidgetProps) => {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Textarea
        className="min-h-[auto] p-2 rounded-none h-12"
        placeholder={label}
      />
    </div>
  );
};
