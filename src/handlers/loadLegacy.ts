import { useFlowStore } from '../store/flow.ts';
import { InputHandle, NodeState, OutputHandle, WidgetState } from '../types.ts';
import { Edge, Node } from 'reactflow';
import { isWidgetInput } from '../utils/node.ts';

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

export function loadLegacyWorkflow(workflow: LegacyWorkflow) {
  const { nodeDefs } = useFlowStore.getState();

  const nodes: Node<NodeState>[] = [];

  for (const node of workflow.nodes) {
    const definition = nodeDefs[node.type];
    if (!definition) continue;

    const widgetDefs = definition.inputs.filter((input) =>
      isWidgetInput(input.type === 'COMBO' ? 'ENUM' : input.type)
    );

    const widgets: Record<string, WidgetState> = {};
    for (let i = 0; i < node.widgets_values?.length; i++) {
      const value = node.widgets_values[i];

      const def = widgetDefs[i];
      if (!def) continue;

      widgets[def.name] = {
        // @ts-expect-error
        value,
        ...def,
        type: def.type,
        name: def.name
      };
    }

    const inputs: InputHandle[] = [];
    if (node.inputs) {
      for (let i = 0; i < node.inputs.length; i++) {
        const input = node.inputs[i];
        if (!isWidgetInput(input.type === 'COMBO' ? 'ENUM' : input.type)) {
          const handle = {
            name: input.name,
            type: input.type,
            widget: input.widget ? widgets[input.widget.name] : undefined
          };

          inputs.push(handle);
        }
      }
    }

    const outputs: OutputHandle[] = [];
    if (node.outputs) {
      for (const output of node.outputs) {
        outputs.push({ type: output.type, name: output.name });
      }
    }

    const config: NodeState['config'] = {};
    if (node.bgcolor) {
      config.bgColor = node.bgcolor;
    }

    if (node.color) {
      config.textColor = node.color;
    }

    const nodeState = {
      config,
      outputs,
      inputs,
      widgets,
      name: node.type
    };

    nodes.push({
      id: node.id.toString(),
      type: node.type,
      position: {
        x: node.pos[0],
        y: node.pos[1]
      },
      data: nodeState,
      width: node.size['0'],
      height: node.size['1']
    } as Node<NodeState>);
  }

  const edges: Edge[] = [];

  for (const link of workflow.links) {
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

    edges.push(edge);
  }

  console.log({ edges, nodes });

  return { edges, nodes };
}
