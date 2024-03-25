// Heavy WIP

import { useFlowStore } from '../../store/flow.ts';
import { Node } from 'reactflow';
import {
  EnumInputState,
  IntInputState,
  NodeState,
  StringInputState,
  WidgetState
} from '../../types.ts';

const { registerNodeCallback, updateWidgetState } = useFlowStore.getState();

export function addValueControlWidgets(
  node: Node<NodeState>,
  targetWidget: WidgetState,
  defaultValue = 'randomize',
  options: any,
  inputData: any
) {
  if (!defaultValue) defaultValue = 'randomize';
  if (!options) options = {};

  const getName = (defaultName: string, optionName: string) => {
    let name = defaultName;
    if (options[optionName]) {
      name = options[optionName];
    } else if (typeof inputData?.[1]?.[defaultName] === 'string') {
      name = inputData?.[1]?.[defaultName];
    } else if (inputData?.[1]?.control_prefix) {
      name = inputData?.[1]?.control_prefix + ' ' + name;
    }
    return name;
  };

  const widgets = [];
  const ctrl: EnumInputState = {
    type: 'ENUM',
    serialize: false,
    isValueControl: true,
    value: ['fixed', 'increment', 'decrement', 'randomize'],
    name: getName('control_after_generate', 'controlAfterGenerateName')
  };
  updateWidgetState({ nodeId: node.id, name: 'filter', newState: ctrl });

  // updateControlWidgetLabel(valueControl);
  widgets.push(ctrl);

  const isEnum = targetWidget.type === 'ENUM';
  let enumFilter: StringInputState;
  if (isEnum && options.addFilterList !== false) {
    enumFilter = {
      type: 'STRING',
      value: '',
      serialize: false,
      name: getName('control_filter_list', 'controlFilterListName')
    };

    // updateControlWidgetLabel(enumFilter);
    widgets.push(enumFilter);

    updateWidgetState({ nodeId: node.id, name: 'filter', newState: enumFilter });
  }

  const applyWidgetControl = () => {
    // var v = ctrl.value;
    //
    // if (isEnum && v !== 'fixed') {
    //   let values = targetWidget.options.values;
    //   const filter = enumFilter?.value;
    //   if (filter) {
    //     let check;
    //     if (filter.startsWith('/') && filter.endsWith('/')) {
    //       try {
    //         const regex = new RegExp(filter.substring(1, filter.length - 1));
    //         check = (item) => regex.test(item);
    //       } catch (error) {
    //         console.error('Error constructing RegExp filter for node ' + node.id, filter, error);
    //       }
    //     }
    //     if (!check) {
    //       const lower = filter.toLocaleLowerCase();
    //       check = (item) => item.toLocaleLowerCase().includes(lower);
    //     }
    //     values = values.filter((item) => check(item));
    //     if (!values.length && targetWidget.options.values.length) {
    //       console.warn('Filter for node ' + node.id + ' has filtered out all items', filter);
    //     }
    //   }
    //   let current_index = values.indexOf(targetWidget.value);
    //   let current_length = values.length;
    //
    //   switch (v) {
    //     case 'increment':
    //       current_index += 1;
    //       break;
    //     case 'decrement':
    //       current_index -= 1;
    //       break;
    //     case 'randomize':
    //       current_index = Math.floor(Math.random() * current_length);
    //     default:
    //       break;
    //   }
    //   current_index = Math.max(0, current_index);
    //   current_index = Math.min(current_length - 1, current_index);
    //   if (current_index >= 0) {
    //     let value = values[current_index];
    //     targetWidget.value = value;
    //     targetWidget.callback(value);
    //   }
    // } else {
    //   //number
    //   let min = targetWidget.options.min;
    //   let max = targetWidget.options.max;
    //   // limit to something that javascript can handle
    //   max = Math.min(1125899906842624, max);
    //   min = Math.max(-1125899906842624, min);
    //   let range = (max - min) / (targetWidget.options.step / 10);
    //
    //   //adjust values based on valueControl Behaviour
    //   switch (v) {
    //     case 'fixed':
    //       break;
    //     case 'increment':
    //       targetWidget.value += targetWidget.options.step / 10;
    //       break;
    //     case 'decrement':
    //       targetWidget.value -= targetWidget.options.step / 10;
    //       break;
    //     case 'randomize':
    //       targetWidget.value =
    //         Math.floor(Math.random() * range) * (targetWidget.options.step / 10) + min;
    //     default:
    //       break;
    //   }
    //   /*check if values are over or under their respective
    //    * ranges and set them to min or max.*/
    //   if (targetWidget.value < min) targetWidget.value = min;
    //
    //   if (targetWidget.value > max) targetWidget.value = max;
    //   targetWidget.callback(targetWidget.value);
    // }

    console.log('applyWidgetControl');
  };

  // valueControl.beforeQueued = () => {
  //   if (controlValueRunBefore) {
  //     // Don't run on first execution
  //     if (valueControl[HAS_EXECUTED]) {
  //       applyWidgetControl();
  //     }
  //   }
  //   valueControl[HAS_EXECUTED] = true;
  // };
  //
  // valueControl.afterQueued = () => {
  //   if (!controlValueRunBefore) {
  //     applyWidgetControl();
  //   }
  // };

  return widgets;
}

function addValueControlWidget(
  node: Node<NodeState>,
  widgetName: string,
  targetWidget: WidgetState,
  inputData: any[],
  defaultValue?: string
) {
  let name = inputData[1]?.control_after_generate;
  if (typeof name !== 'string') {
    name = widgetName;
  }

  const widgets = addValueControlWidgets(
    node,
    targetWidget,
    defaultValue,
    {
      addFilterList: false,
      controlAfterGenerateName: name
    },
    inputData
  );

  return widgets[0];
}

function seedWidget(
  node: Node<NodeState>,
  inputName: string,
  inputData: any[],
  widgetName: string
) {
  const seed: IntInputState = {
    value: 0,
    type: 'INT',
    name: inputName
  };

  const seedControl = addValueControlWidget(node, widgetName, seed, inputData, 'randomize');
  seed.linkedWidgets = [seedControl];
  return seed;
}
