import { IMenuType, NodeState } from './types.ts';
import { Node } from 'reactflow';
import { useFlowStore } from '../store/flow.ts';
import {
  convertNodeInputToWidget,
  convertNodeWidgetToInput,
  hideNodeWidget,
  removeNodeInput,
  showNodeWidget
} from './utils/node.ts';
import { categorizeObjects } from './utils/ui.tsx';
import type { MouseEvent as ReactMouseEvent } from 'react';

export function getNodeMenuItems(node: Node<NodeState>) {
  const rest = { hasSubMenu: false, disabled: false, subMenu: null, data: null };

  const to_inputs = Object.values(node.data.widgets)
    .map((widget) =>
      !widget.hidden
        ? {
            label: `Convert ${widget.name} to input`,
            onClick: () => {
              const { updateNodeState } = useFlowStore.getState();
              if (!node.type) return;

              const input = convertNodeWidgetToInput(node, widget.name);
              if (input) {
                const inputs = [...node.data.inputs];
                inputs.push(input);

                updateNodeState(node.id, { inputs });
                hideNodeWidget(node, widget.name);
              }
            },
            ...rest
          }
        : undefined
    )
    .filter(Boolean) as IMenuType[];

  const to_widgets = node.data.inputs
    .map((value, i) =>
      value.widget
        ? {
            label: `Convert ${value.name} to widget`,
            onClick: () => {
              const { updateNodeState } = useFlowStore.getState();

              const input = node.data.inputs[i];
              if (input && input.widget) {
                const widget = convertNodeInputToWidget(node, i);
                if (!widget) return;

                node.data.widgets[value.name] = widget;
              }

              removeNodeInput(node, i);
              showNodeWidget(node, value.name);
              updateNodeState(node.id, node.data);
            },
            ...rest
          }
        : null
    )
    .filter(Boolean) as IMenuType[];

  const items: (IMenuType | null)[] = [
    { label: 'Inputs', hasSubMenu: true, disabled: true, subMenu: null, data: null },
    { label: 'Outputs', hasSubMenu: true, disabled: true, subMenu: null, data: null },

    null,

    {
      label: 'Convert to Group Node',
      hasSubMenu: false,
      disabled: true,
      subMenu: null,
      data: null
    },
    { label: 'Properties', hasSubMenu: true, disabled: false, subMenu: null, data: null },
    { label: 'Properties Panel', hasSubMenu: false, disabled: false, subMenu: null, data: null },

    null,

    { label: 'Title', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    { label: 'Mode', hasSubMenu: true, disabled: false, subMenu: null, data: null },
    { label: 'Resize', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    { label: 'Collapse', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    { label: 'Pin', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    { label: 'Colors', hasSubMenu: true, disabled: false, subMenu: null, data: null },
    { label: 'Shapes', hasSubMenu: true, disabled: false, subMenu: null, data: null },

    null,

    { label: 'Bypass', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    { label: 'Copy (Clipspace)', hasSubMenu: false, disabled: false, subMenu: null, data: null },
    ...to_inputs,

    null,

    ...(to_widgets.length > 0 ? [...to_widgets, null] : to_widgets),

    {
      label: 'Clone',
      hasSubMenu: false,
      disabled: false,
      subMenu: null,
      data: node.id,
      onClick: () => cloneNode(node.id)
    },

    null,

    {
      label: 'Remove',
      hasSubMenu: false,
      disabled: false,
      subMenu: null,
      data: node.id,
      onClick: () => removeNode(node.id)
    }
  ];

  return items;
}

function removeNode(id: string) {
  const { removeNode } = useFlowStore.getState();
  removeNode(id);
}

function cloneNode(id: string) {
  const { nodes, addRawNode } = useFlowStore.getState();
  const node = nodes.find((node) => node.id == id);
  if (!node) return;

  const newNode = {
    ...structuredClone(node),
    id: crypto.randomUUID()
  };

  addRawNode(newNode);
}

export function getContextMenuItems() {
  const state = useFlowStore.getState();

  return [
    {
      data: null,
      subMenu: categorizeObjects(state.nodeDefs),
      isOpen: false,
      disabled: false,
      hasSubMenu: true,
      label: 'Add Node',
      onClick: (event: ReactMouseEvent) => null
    },
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: true,
      hasSubMenu: false,
      label: 'Add Group',
      onClick: (event: ReactMouseEvent) => null
    },
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: false,
      hasSubMenu: false,
      label: 'Add group for selected nodes',
      onClick: (event: ReactMouseEvent) => null
    },
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: false,
      hasSubMenu: false,
      label: 'Convert to group node',
      onClick: (event: ReactMouseEvent) => null
    },
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: false,
      hasSubMenu: false,
      label: 'Manage group nodes',
      onClick: (event: ReactMouseEvent) => null
    },
    null,
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: false,
      hasSubMenu: false,
      label: 'Follow execution',
      onClick: (event: ReactMouseEvent) => null
    },
    {
      data: null,
      subMenu: [],
      isOpen: false,
      disabled: false,
      hasSubMenu: true,
      label: 'Go to node',
      onClick: (event: ReactMouseEvent) => null
    }
  ] as (IMenuType | null)[];
}
