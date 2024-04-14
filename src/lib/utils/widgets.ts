import {
  AddValueControlWidget,
  EnumInputState,
  InputDef,
  IntInputDef,
  NodeState,
  UpdateWidgetState,
  WidgetState
} from '../types.ts';
import { controlAfterGenerateDef } from '../config/constants.ts';
import { Node } from 'reactflow';

export function createValueControlWidgets(args: AddValueControlWidget) {
  const widgets: Record<string, WidgetState> = {};
  const { widget, options = {}, defaultValue } = args;
  const name = options.controlAfterGenerateName ?? 'control_after_generate';

  widgets[name] = {
    name,
    type: 'ENUM',
    serialize: true,
    valueControl: true,
    value: defaultValue ?? 'randomize',
    definition: controlAfterGenerateDef
  } as EnumInputState;

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

export function applyWidgetControl(node: Node<NodeState>, updater: UpdateWidgetState) {
  const {
    data: { widgets }
  } = node;
  for (const name in widgets) {
    const widget = widgets[name];
    if (!widget.linkedWidgets || !('value' in widget)) continue;

    for (const link of widget.linkedWidgets) {
      const linkedWidget = widgets[link];
      if (!linkedWidget || linkedWidget.type !== 'ENUM') continue;

      if (linkedWidget.valueControl) {
        let value = Number(widget.value);
        if (isNaN(value)) continue;

        let {
          min = 0,
          step = 1,
          max = 1125899906842624
        } = (widget.definition as IntInputDef) ?? {};

        max = Math.min(1125899906842624, max);
        min = Math.max(-1125899906842624, min);

        let range = (max - min) / step;
        switch (linkedWidget.value) {
          case 'increment':
            value += step;
            break;
          case 'decrement':
            value -= step;
            break;
          case 'randomize':
            value = Math.floor(Math.random() * range) * step + min;
            break;
        }

        if (value < min) value = min;
        if (value > max) value = max;

        updater({ nodeId: node.id, name, data: { value } });
      }
    }
  }
}
