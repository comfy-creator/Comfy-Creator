import { IMenuType, NodeState } from './types.ts';
import { Node } from 'reactflow';
import { useFlowStore } from './store/flow.ts';
import {
  convertInputToWidget,
  convertWidgetToInput
} from './components/templates/PrimitiveNode.tsx';

export function getNodeMenuItems(node: Node<NodeState>) {
  const { nodeDefs } = useFlowStore.getState();

  const rest = { hasSubMenu: false, disabled: false, subMenu: null, node: null };
  const to_inputs = Object.values(node.data.widgets).map((widget) => ({
    label: `Convert ${widget.name} to input`,
    onClick: () => {
      const { updateNodeState } = useFlowStore.getState();
      if (!node.type) return;

      const slot = Object.keys(node.data.inputs).length;
      const input = convertWidgetToInput({ widgetName: widget.name, node });
      if (input) {
        node.data.inputs[slot] = input;
        delete node.data.widgets[widget.name];

        updateNodeState(node.id, node.data);
      }
    },
    ...rest
  }));

  const to_widgets = Object.entries(node.data.inputs)
    .map(([key, value]) =>
      value.primitive
        ? {
            label: `Convert ${value.name} to widget`,
            onClick: () => {
              const { updateNodeState } = useFlowStore.getState();

              const input = node.data.inputs[Number(key)];
              if (input && input.widget) {
                const widget = convertInputToWidget(input, node);
                if (!widget) return;

                node.data.widgets[value.name] = widget;
              }

              delete node.data.inputs[Number(key)];
              updateNodeState(node.id, node.data);
            },
            ...rest
          }
        : undefined
    )
    .filter(Boolean) as IMenuType[];

  const items: (IMenuType | null)[] = [
    { label: 'Inputs', hasSubMenu: true, disabled: true, subMenu: null, node: null },
    { label: 'Outputs', hasSubMenu: true, disabled: true, subMenu: null, node: null },

    null,

    {
      label: 'Convert to Group Node',
      hasSubMenu: false,
      disabled: true,
      subMenu: null,
      node: null
    },
    { label: 'Properties', hasSubMenu: true, disabled: false, subMenu: null, node: null },
    { label: 'Properties Panel', hasSubMenu: false, disabled: false, subMenu: null, node: null },

    null,

    { label: 'Title', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    { label: 'Mode', hasSubMenu: true, disabled: false, subMenu: null, node: null },
    { label: 'Resize', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    { label: 'Collapse', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    { label: 'Pin', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    { label: 'Colors', hasSubMenu: true, disabled: false, subMenu: null, node: null },
    { label: 'Shapes', hasSubMenu: true, disabled: false, subMenu: null, node: null },

    null,

    { label: 'Bypass', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    { label: 'Copy (Clipspace)', hasSubMenu: false, disabled: false, subMenu: null, node: null },
    ...to_inputs,

    null,

    ...(to_widgets.length > 0 ? [...to_widgets, null] : to_widgets),

    { label: 'Clone', hasSubMenu: false, disabled: false, subMenu: null, node: null },

    null,

    { label: 'Remove', hasSubMenu: false, disabled: false, subMenu: null, node: null }
  ];

  return items;
}
