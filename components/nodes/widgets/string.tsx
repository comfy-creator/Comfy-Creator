import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StringWidgetProps {
  label: string;
}

export const StringWidget = ({ label }: StringWidgetProps) => {
  return (
    <div className="flex flex-col gap-1">
 <Label className="text-[12px] font-medium">{label}</Label>

      <Input
        type="text"
        placeholder={label}
        className="h-8 text-xs p-2 rounded-none"
      />
    </div>
  );
};
