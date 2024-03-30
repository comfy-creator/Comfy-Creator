import { AddValueControlWidget, EnumInputState, InputDef, WidgetState } from '../types.ts';

export function createValueControlWidgets({
  widget,
  options,
  inputDef,
  defaultValue
}: AddValueControlWidget) {
  if (!options) options = {};
  const widgets: Record<string, WidgetState> = {};

  const name = options.controlAfterGenerateName ?? inputDef.name ?? 'control_after_generate';
  const afterGenerateWidget: EnumInputState = {
    name,
    type: 'ENUM',
    definition: inputDef,
    serialize: inputDef.serialize,
    valueControl: inputDef.valueControl,
    value: defaultValue ?? 'randomize'
  };

  widgets[name] = afterGenerateWidget;

  const isEnumWidget = widget.type === 'ENUM';
  if (isEnumWidget && options.addFilterList !== false) {
    widgets['control_filter_list'] = {
      value: '',
      type: 'STRING',
      serialize: false,
      name: 'control_filter_list'
    };
  }

  return widgets;
}

export function createValueControlWidget(data: AddValueControlWidget) {
  const widgets = createValueControlWidgets(data);
  return widgets[Object.keys(widgets)[0]];
}

export function isSeedWidget(widget: WidgetState | InputDef) {
  return widget.type === 'INT' && widget.name === 'seed';
}
