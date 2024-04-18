import {
  BooleanInputProps,
  ComboInputProps,
  NumberInputProps,
  SliderInputProps,
  TextInputProps
} from '../types/many.ts';
import { useSettingsStore } from '../store/settings.ts';

export function BooleanInput({ id, onChange, setSettingValue }: BooleanInputProps) {
  const htmlID = id.replaceAll('.', '-');
  const settingsValues = useSettingsStore((s) => s.settingsValues);

  return (
    <>
      <input
        id={htmlID}
        type="checkbox"
        checked={settingsValues['Comfy.Settings.' + id]}
        onChange={(event) => {
          const isChecked = event.target.checked;

          onChange?.(isChecked);
          setSettingValue(id, isChecked);
        }}
      />
    </>
  );
}

export function NumberInput({ id, setter, attrs }: NumberInputProps) {
  const htmlID = id.replaceAll('.', '-');
  const settingsValues = useSettingsStore((s) => s.settingsValues);

  return (
    <input
      id={htmlID}
      type="number"
      value={settingsValues['Comfy.Settings.' + id]}
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        setter(target.value);
      }}
      {...attrs}
    />
  );
}

export function SliderInput({ id, setter, attrs }: SliderInputProps) {
  const htmlID = id.replaceAll('.', '-');
  const settingsValues = useSettingsStore((s) => s.settingsValues);

  return (
    <div style={{ display: 'grid', gridAutoFlow: 'column' }}>
      <input
        {...attrs}
        value={settingsValues['Comfy.Settings.' + id]}
        type="range"
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          setter(target.value);
          if (target.nextElementSibling instanceof HTMLInputElement) {
            target.nextElementSibling.value = target.value;
          }
        }}
      />
      <input
        id={htmlID}
        type="number"
        style={{ maxWidth: '4rem' }}
        value={settingsValues['Comfy.Settings.' + id]}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          setter(target.value);
          if (target.previousElementSibling instanceof HTMLInputElement) {
            target.previousElementSibling.value = target.value;
          }
        }}
        {...attrs}
      />
    </div>
  );
}

export function ComboInput({ options, setter, value }: ComboInputProps) {
  return (
    <select
      onInput={(e) => {
        const target = e.target as HTMLSelectElement;
        setter(target.value);
      }}
    >
      {(typeof options === 'function' ? options(value) : options || []).map((opt) => {
        if (typeof opt === 'string') {
          opt = { text: opt };
        }
        const v = opt.value ?? opt.text;
        return (
          <option value={v} selected={value + '' === v + ''}>
            {opt.text}
          </option>
        );
      })}
    </select>
  );
}

export function TextInput({ id, setter, attrs }: TextInputProps) {
  const htmlID = id.replaceAll('.', '-');
  const settingsValues = useSettingsStore((s) => s.settingsValues);

  return (
    <input
      id={htmlID}
      value={settingsValues['Comfy.Settings.' + id]}
      onInput={(e) => {
        const target = e.target as HTMLInputElement;
        setter(target.value);
      }}
      {...attrs}
    />
  );
}
