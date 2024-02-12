import { ToggleWidget } from "../../types.ts";

export function Toggle({ options, disabled, value, onChange }: ToggleWidget) {
  return (
    <>
      <input
        value={value}
        type="checkbox"
        disabled={disabled}
        onChange={(e) => {
          onChange?.(e);
        }}
      />{" "}
      {value ? options?.on || "true" : options?.off || "false"}
    </>
  );
}
