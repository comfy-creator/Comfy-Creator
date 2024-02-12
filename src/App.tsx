// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { useCallback, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeChange,
  EdgeChange,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Connection,
  NodeResizer,
  NodeToolbar,
} from 'reactflow';
import { TextNode } from './custom_nodes/text';

import { NodeTemplate } from './custom_nodes2/node';
import { videoModelDef } from './custom_nodes2/nodeVideoModel';
import { NodeData } from './custom_nodes2/types';
import { imageUpscaleWithModelDef, upscaleModelLoaderDef } from './custom_nodes2/nodeUpscaleModel';

import 'reactflow/dist/style.css';
import './custom_nodes/text.css';

type NodeType = {
  id: string;
  type?: string;
  data: { text?: string; label?: string; };
  position: { x: number; y: number; };
};

const initialNodeTypes = { 
  ClipTextEncode: TextNode, 
  videoNode: () => <NodeTemplate data={videoModelDef} />,
  upscaleModelLoader: () => <NodeTemplate data={upscaleModelLoaderDef} />,
  upscaleWithModel: () => <NodeTemplate data={imageUpscaleWithModelDef} />,
};

const edgeTypes = { CLIP: 'clip' };

const initNodes: NodeType[] = [
    {
    id: 'VideoA',
      type: 'videoNode',
    data: { text: 'Node A' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'TextA',
      type: 'ClipTextEncode',
    data: { text: 'Node A' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'TextB',
    type: 'ClipTextEncode',
    data: { text: 'Node B' },
    position: { x: 100, y: 100 },
  },
  {
    id: 'PositivePrompt',
    type: 'ClipTextEncode',
    data: { text: 'Hello world' },
    position: { x: 120, y: 130 },
  },
    {
    id: 'Input',
    type: 'input',
    data: { label: 'input' },
    position: { x: 120, y: 130 },
  },
      {
    id: 'Output',
    type: 'output',
    data: { label: 'output' },
    position: { x: 120, y: 130 },
  },
  {
    id: 'Group',
    type: 'group',
    data: { label: 'group' },
    position: { x: 0, y: 0 },
  },
    {
    id: 'UpscaleLoader',
    type: 'upscaleModelLoader',
    data: { label: 'group' },
    position: { x: 0, y: 0 },
  },
    {
    id: 'UpscaleWithModel',
    type: 'upscaleWithModel',
    data: { label: 'group' },
    position: { x: 0, y: 0 },
  },
];


const initEdges = [
  {
    id: 'A->B',
    source: 'TextA',
    target: 'TextB',
  },
];

function App() {
  // const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);
  const [nodeTypes, setNodeTypes] = useState(initialNodeTypes);

  // Standard React Flow Handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds as NodeType[])),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Successor to ComfyUI function
  function registerNodesFromDefs(defs: Record<string, NodeData>) {
    for (const [key, value] of Object.entries(defs)) {
        registerNode(key, value);
    }
  }

  // We should let pluings register arbitrary components
  function registerNode(nodeId: string, nodeData: NodeData) {
    setNodeTypes((prev) => ({
      ...prev,
      [nodeId]: () => <NodeTemplate data={nodeData} />
    }));
  }

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
      <NodeResizer />
      <NodeToolbar />
    </ReactFlow>
  );
}

export default App;
