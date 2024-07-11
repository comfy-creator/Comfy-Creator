import {
  HandleState,
  NodeData,
  UpdateInputData,
  WidgetState
} from '../types/types.ts';
import { controlAfterGenerateDef } from '../config/constants.ts';
import { Node } from 'reactflow';
import { isWidgetType } from './node.ts';

export function createValueControlInputs(args: any) {
  const widgets: Record<string, WidgetState> = {};
  const { input, options = {}, defaultValue } = args;
  const name = options.controlAfterGenerateName ?? 'control_after_generate';

  widgets[name] = {
    display_name: name,
    widget_type: 'ENUM',
    props: {
      serialize: true,
      valueControl: true,
      value: defaultValue ?? 'randomize',
      definition: controlAfterGenerateDef
    }
  };

  const isEnumInput = input.type === 'ENUM';
  if (isEnumInput && options.addFilterList !== false) {
    widgets['control_filter_list'] = {
      display_name: 'control_filter_list',
      widget_type: 'STRING',
      props: {
        value: '',
        serialize: false,
      }
    };
  }

  return widgets;
}

export function createValueControlInput(data: any) {
  const widgets = createValueControlInputs(data);
  return widgets[Object.keys(widgets)[0]];
}

export function isSeedInput(widget: WidgetState) {
  return widget.widget_type === 'INT' && widget.display_name === 'seed';
}

export function applyInputControl(node: Node<NodeData>, updater: UpdateInputData) {
  const {
    data: { inputs }
  } = node;

  for (const name in inputs) {
    const input = inputs[name];
    if (!isWidgetType(input.edge_type)) continue;
    // if (!input.linkedInputs || !('value' in input)) continue;

    // for (const link of input.linkedInputs) {
    //   const linkedInput = Object.values(inputs).find((input) => input.name === link);
    //   if (!linkedInput || linkedInput.type !== 'ENUM') continue;

    //   if (linkedInput.valueControl) {
    //     let value = Number(input.value);
    //     if (isNaN(value)) continue;

    //     // TODO: Load config from input definition
    //     let { min = 0, step = 1, max = 1125899906842624 } = {};

    //     max = Math.min(1125899906842624, max);
    //     min = Math.max(-1125899906842624, min);

    //     let range = (max - min) / step;
    //     switch (linkedInput.value) {
    //       case 'increment':
    //         value += step;
    //         break;
    //       case 'decrement':
    //         value -= step;
    //         break;
    //       case 'randomize':
    //         value = Math.floor(Math.random() * range) * step + min;
    //         break;
    //     }

    //     if (value < min) value = min;
    //     if (value > max) value = max;

    //     updater({ nodeId: node.id, display_name: input.display_name, data: { value } });
    //   }
    // }
  }
}
