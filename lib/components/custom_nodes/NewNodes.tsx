import React, { useState, useEffect } from 'react';
import ReactFlow, {
   Node,
   Edge,
   Handle,
   Position,
   useReactFlow,
   useNodesState,
   useEdgesState
} from 'reactflow';
import { NodeData } from '../../types/types';

export type Interface = {
   inputs: string[];
   outputs: string[];
};

const GraphWrapper = () => {
   const [nodes, setNodes, onNodesChange] = useNodesState([]);
   const [edges, setEdges, onEdgesChange] = useEdgesState([]);

   const handleNodeInputChange = (nodeId: string, newInputs: string[]) => {
      const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return;

      const node = nodes[nodeIndex];
      const newInterface = node.data.definition.factory(newInputs);

      // Update node with new interface
      const newNode = {
         ...node,
         data: {
            ...node.data,
            inputs: newInterface.inputs,
            outputs: newInterface.outputs,
            widgets: newInterface.widgets
         }
      };

      const newNodes = [...nodes];
      newNodes[nodeIndex] = newNode;
      setNodes(newNodes);

      // Update edges and propagate changes
      updateEdgesAndPropagate(newNode);
   };

   const updateEdgesAndPropagate = (node: Node<NodeData>) => {
      const connectedEdges = edges.filter(
         (edge) => edge.source === node.id || edge.target === node.id
      );
      const validEdges = connectedEdges.filter((edge) => {
         const sourceNode = nodes.find((n) => n.id === edge.source);
         const targetNode = nodes.find((n) => n.id === edge.target);
         return (
            sourceNode &&
            targetNode &&
            sourceNode.data.outputs[edge.sourceHandle] &&
            targetNode.data.inputs[edge.targetHandle]
         );
      });

      setEdges(validEdges);

      // Propagate changes to connected nodes
      validEdges.forEach((edge) => {
         if (edge.source === node.id) {
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (targetNode) {
               handleNodeInputChange(targetNode.id, targetNode.data.inputs);
            }
         }
      });
   };

   return (
      <ReactFlow
         nodes={nodes}
         edges={edges}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
      />
   );
};

export default GraphWrapper;

const DynamicNode = ({ data }) => {
   const { setEdges, edges } = useReactFlow();

   useEffect(() => {
      const newInterface = computeInterface(data.inputs);
      setNodeInterface(newInterface);
      updateEdges(newInterface);
   }, [data.inputs]);

   const computeInterface = (inputs) => {
      // Logic to compute inputs and outputs based on current inputs
      return {
         inputs: inputs.map((input, index) => ({ id: `in-${index}`, type: 'input', label: input })),
         outputs: [{ id: 'out-0', type: 'output', label: 'Result' }]
      };
   };

   const updateEdges = (newInterface) => {
      const validEdges = edges.filter(
         (edge) =>
            newInterface.inputs.some((input) => input.id === edge.sourceHandle) &&
            newInterface.outputs.some((output) => output.id === edge.targetHandle)
      );
      setEdges(validEdges);
   };

   return (
      <div>
         {nodeInterface.inputs.map((input, index) => (
            <Handle
               key={input.id}
               type="target"
               position={Position.Left}
               id={input.id}
               style={{ background: '#555' }}
            />
         ))}
         {nodeInterface.outputs.map((output) => (
            <Handle
               key={output.id}
               type="source"
               position={Position.Right}
               id={output.id}
               style={{ background: '#555' }}
            />
         ))}
         <div>{/* Render node content here */}</div>
      </div>
   );
};

export { DynamicNode };
