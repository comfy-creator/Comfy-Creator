import { NodeDefinition, NodeState, WidgetState } from '../../types.ts';
import { Node } from 'reactflow';

interface PrimitiveNodeProps {}

const primitive: NodeDefinition = {
  inputs: [],
  category: 'utils',
  output_node: true,
  display_name: 'Primitive',
  description: 'Primitive Node',
  outputs: [{ type: '*', name: 'connect widget to input' }]
};

export function addWidgetToNode(name: string, node: Node<NodeState>, primitive: Node<NodeState>) {
  // const widget = def.inputs.find((v) => v.name === name);
  const widgets: Record<string, WidgetState> = {};
  for (const key in node.data.widgets) {
    const widget = node.data.widgets[key];

    if (widget.name === name) {
      widgets[widget.name] = widget;
    }
  }

  primitive.data.widgets = {
    ...primitive.data.widgets,
    ...widgets
  };
}
