import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface SliderWidgetProps {
  label: string;
}

export const SliderWidget = ({ label }: SliderWidgetProps) => {
  // TODO: Make this dynamic
  const [value, setValue] = useState(4);

  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0]);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[12px] font-medium">{label}</Label>

      <div className="flex flex-row space-x-4">
        <div dir="ltr" className="relative flex w-full touch-none select-none items-center">
          <Slider
            className="relative h-2 w-full grow overflow-visible rounded bg-muted border border-border-muted"
            value={[value]}
            onValueChange={handleSliderChange}
            max={4}
            min={1}
            step={1}
            aria-label="model-input-slider-num_inference_steps"
          />
        </div>
        <Input
          type="number"
          className="h-10 rounded border border-border-muted bg-muted px-2 py-1 text-sm font-medium text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 w-24"
          id="model-input-num_inference_steps"
          name="num_inference_steps"
          min="1"
          max="4"
          value={value}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};
