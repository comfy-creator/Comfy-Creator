import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

// enums are basically dropdowns
interface EnumWidgetProps {
  label: string;
}

export const EnumWidget = ({ label }: EnumWidgetProps) => {
  const [selectedValue, setSelectedValue] = useState("webp"); // Default value

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[12px] font-medium">{label}</Label>

      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger
          id="model-input-output_format"
          className="flex w-fit min-w-[110px] items-center justify-between rounded font-heading text-foreground border border-border hover:border-border-strong px-3 py-[2px] font-medium transition-colors focus:ring disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Output Format"
        >
          <span>{selectedValue}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webp">WebP</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


















