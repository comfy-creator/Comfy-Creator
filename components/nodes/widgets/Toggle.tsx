
import { Label } from "@/components/ui/label";
import { Switch } from "@radix-ui/react-switch";
import { useState } from "react";

interface ToggleWidgetProps {
  label: string;
}

export const ToggleWidget = ({ label }: ToggleWidgetProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[12px] font-medium">{label}</Label>
      <Switch
        id="model-input-enable_safety_checker"
        aria-label="Enable Safety Checker"
        checked={isChecked}
        onCheckedChange={handleToggle}
        className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded border-2 border-transparent bg-muted transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${isChecked ? 'bg-primary' : ''}`}
      >
        <span className={`pointer-events-none block h-5 w-5 rounded bg-background shadow-sm ring-0 transition-transform ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}></span>
      </Switch>
    </div>
  );
};
