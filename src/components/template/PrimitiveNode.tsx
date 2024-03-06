import { EdgeType, InputHandle, NodeState, WidgetState } from '../../types.ts';
import { Node } from 'reactflow';
import { useFlowStore } from '../../store/flow.ts';

const CONVERTABLE_TYPES: EdgeType[] = ['STRING', 'ENUM', 'INT', 'FLOAT', 'BOOLEAN'];

interface ConvertWidgetToInputProps {
  widgetName: string;
  node: Node<NodeState>;
}

export function convertWidgetToInput({ node, widgetName }: ConvertWidgetToInputProps) {
  const { widgets } = node.data;
  const { nodeDefs } = useFlowStore.getState();

  const widget = widgets[widgetName];
  if (!widget || !isConvertableWidget(widget)) return;
  if (!node.type) return;

  const config = nodeDefs[node.type]?.inputs.find((input) => input.name === widgetName);
  if (!config) return;

  return {
    type: '*',
    name: widget.name,
    optional: widget.optional,
    widget: { ...widget, config }
  } as InputHandle;
}

export function convertInputToWidget(input: InputHandle, node: Node<NodeState>) {
  if (!input.widget) return;

  let widget = node.data.widgets[input.widget.name];
  if (input.primitive) {
    const primitive = useFlowStore.getState().nodes.find((node) => node.id == input.primitive);
    if (primitive) {
      widget = primitive.data.widgets[input.widget.name];
      delete primitive.data.widgets[input.widget.name];
      useFlowStore.getState().updateNodeState(primitive.id, primitive.data);
    }
  }

  return widget ?? input.widget;
}

export function addWidgetToNode(slot: number, node: Node<NodeState>, primitive: Node<NodeState>) {
  const { updateNodeState } = useFlowStore.getState();
  const input = node.data.inputs[slot];
  if (!input.widget) return;

  updateNodeState(node.id, {
    inputs: {
      ...node.data.inputs,
      [slot]: {
        ...input,
        type: input.widget.type,
        primitive: primitive.id
      }
    }
  });

  updateNodeState(primitive.id, {
    widgets: {
      [input.widget.name]: input.widget
    },
    outputs: {
      1: {
        name: input.widget.type,
        type: input.widget.type
      }
    }
  });
}

export function addOutputTypeToNode(
  slot: number,
  node: Node<NodeState>,
  primitive: Node<NodeState>
) {
  const { updateNodeState } = useFlowStore.getState();
  const input = node.data.inputs[slot];
  if (!input.widget) return;

  updateNodeState(primitive.id, {
    outputs: {
      1: {
        name: '',
        type: input.widget.type
      }
    }
  });
}

export function addInputTypeToNode(
  slot: number,
  node: Node<NodeState>,
  primitive: Node<NodeState>
) {
  const { updateNodeState } = useFlowStore.getState();
  const input = node.data.inputs[slot];
  if (!input.widget) return;

  updateNodeState(primitive.id, {
    inputs: {
      1: {
        name: '',
        type: input.widget.type
      }
    }
  });
}

function isConvertableWidget(widget: WidgetState) {
  return CONVERTABLE_TYPES.includes(widget.type);
}
