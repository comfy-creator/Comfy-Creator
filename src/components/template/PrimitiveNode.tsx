import { EdgeType, InputHandle, NodeDefinition, NodeState, WidgetState } from '../../types.ts';
import { Node } from 'reactflow';
import { useFlowStore } from '../../store/flow.ts';

interface PrimitiveNodeProps {}

const primitive: NodeDefinition = {
  inputs: [],
  category: 'utils',
  output_node: true,
  display_name: 'Primitive',
  description: 'Primitive Node',
  outputs: [{ type: '*', name: 'connect widget to input' }]
};

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

  const widget = node.data.widgets[input.widget.name];
  return widget ?? input.widget;
}

export function transfer(name: string, node: Node<NodeState>) {
  const { updateNodeState } = useFlowStore.getState();

  const input = convertWidgetToInput({ node, widgetName: name });
  if (!input) return;

  const inputSlot = Object.keys(node.data.inputs).length;
  updateNodeState(node.id, { inputs: { [inputSlot]: input } });
}

export function receive(input: InputHandle, node: Node<NodeState>) {
  const { updateNodeState } = useFlowStore.getState();

  const widget = convertInputToWidget(input, node);
  if (!widget) return;

  updateNodeState(node.id, { widgets: { value: widget } });
}

export function addWidgetToNode(slot: string, node: Node<NodeState>, primitive: Node<NodeState>) {
  const { updateNodeState } = useFlowStore.getState();
  const input = node.data.inputs[Number(slot)];
  if (!input.widget) return;

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

function isConvertableWidget(widget: WidgetState) {
  return CONVERTABLE_TYPES.includes(widget.type);
}
