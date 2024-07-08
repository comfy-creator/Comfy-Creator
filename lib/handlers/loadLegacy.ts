import {
  EdgeType,
  InputData,
  InputDef,
  NodeData,
  NodeDefinition,
  OutputData
} from '../types/types.ts';
import { Edge, Node } from 'reactflow';
import { isWidgetType } from '../utils/node.ts';

interface LegacyWorkflow {
  groups: any[];
  version: number;
  extra: Record<string, any>;
  config: Record<string, any>;
  links: LegacyLink[];
  nodes: LegacyNode[];
  last_link_id: number;
  last_node_id: number;
}

interface LegacyNode {
  id: number;
  type: string;
  mode: number;
  order: number;
  color?: string;
  bgcolor?: string;
  pos: [number, number];
  inputs: LegacyNodeInput[];
  outputs: LegacyNodeOutput[];
  properties: Record<string, any>;
  size: { '0': number; '1': number };
  widgets_values: (string | number | boolean | string[])[];
  flags: { pinned?: boolean; collapsed?: boolean };
}

interface LegacyNodeInput {
  name: string;
  type: string;
  link?: number;
  widget?: {
    name: string;
  };
  slot_index?: number;
}

interface LegacyNodeOutput {
  name: string;
  type: string;
  links: number[];
  slot_index: number;
}

// ComfyUI Serialized link, format:
// [link_id, origin_id, origin_slot, target_id, target_slot, link_type]
type LegacyLink = [number, number, number, number, number, string];

function isValidDefinition(definition: any) {
  return !!definition;
}

function isValidWidgetDef(def: any, i: number, widgets_values: any[]) {
  return !!def && !!widgets_values[i];
}

function getWidgets(node: LegacyNode, nodeDefs: any) {
  const definition = nodeDefs[node.type];
  const widgetDefs = definition.inputs.filter((input: InputDef | { type: 'COMBO' }) =>
    isWidgetType(input.type === 'COMBO' ? 'ENUM' : input.type)
  );

  const widgets: Record<string, InputData> = {};
  node.widgets_values?.forEach((value, i) => {
    const def = widgetDefs[i];
    if (isValidWidgetDef(def, i, node.widgets_values)) {
      widgets[def.name] = {
        value,
        ...def,
        name: def.name,
        type: def.type === 'COMBO' ? 'ENUM' : def.type
      };
    }
  });

  return widgets;
}

function getInputs(node: LegacyNode, widgets: Record<string, InputData>) {
  if (!node.inputs?.length) return {};

  const inputs: Record<string, InputData> = {};

  let currentSlot = 0;
  for (let i = 0; i < node.inputs.length; i++) {
    const input = node.inputs[i];
    const type = (input.type === 'COMBO' ? 'ENUM' : input.type) as EdgeType;

    if (!isWidgetType(type)) {
      inputs[input.name] = {
        type,
        name: input.name,
        slot: currentSlot
      };

      currentSlot += 1;
    }
  }

  return inputs;
}

function getOutputs(node: LegacyNode) {
  if (!node.outputs?.length) return {};

  const outputs: Record<string, OutputData> = {};
  for (let i = 0; i < node.outputs.length; i++) {
    const output = node.outputs[i];
    const type = (output.type === 'COMBO' ? 'ENUM' : output.type) as EdgeType;
    outputs[output.name] = { type: type, name: output.name, slot: i };
  }

  return outputs;
}

function getNodeData(node: LegacyNode, widgets: Record<string, InputData>) {
  const nodeState = {
    outputs: getOutputs(node),
    inputs: getInputs(node, widgets),
    name: node.type,
    widgets
  };

  return nodeState;
}

function getNode(node: LegacyNode, nodeDefs: any) {
  const widgets = getWidgets(node, nodeDefs);
  const nodeState = getNodeData(node, widgets);

  const x = node.pos[0];
  const y = node.pos[0];

  const nodeElement: Node<NodeData> = {
    id: String(node.id),
    type: node.type,
    data: nodeState,
    position: { x, y },
    width: node.size['0'],
    height: node.size['1']
  };

  return nodeElement;
}

function getEdge(link: LegacyLink) {
  let targetHandle = '';
  let sourceHandle = '';

  if (!link[2].toString().includes('::')) {
    sourceHandle = `output::${link[2]}::${link[5]}`;
  }

  if (!link[4].toString().includes('::')) {
    targetHandle = `input::${link[4]}::${link[5]}`;
  }

  const edge: Edge = {
    type: link[5],
    id: link[0].toString(),
    source: link[1].toString(),
    target: link[3].toString(),
    sourceHandle,
    targetHandle
  };

  return edge;
}

export function loadLegacyWorkflow(
  workflow: LegacyWorkflow,
  nodeDefs: Record<string, NodeDefinition>
) {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  workflow.nodes.forEach((node) => {
    const definition = nodeDefs[node.type];
    if (isValidDefinition(definition)) {
      nodes.push(getNode(node, nodeDefs));
    }
  });

  workflow.links.forEach((link) => {
    edges.push(getEdge(link));
  });

  return { edges, nodes };
}