import { getSuggestedNodesData } from '../utils/menu';
import { useFlowStore } from '../store/flow';
import { Connection, Edge, getOutgoers, Node, OnConnectStartParams } from '@xyflow/react';
import { getHandleName, isPrimitiveNode, isWidgetType } from '../utils/node';
import { AppNode, HandleOnConnectEndParams, ValidateConnectionParams } from '../types/types';

export function handleOnConnectEnd({ onContextMenu }: HandleOnConnectEndParams) {
   // ReactMouseEvent | TouchEvent instead ?
   // TODO: this logic may be wrong here? We're mixing react-events with native-events!
   return async (event: MouseEvent | globalThis.TouchEvent) => {
      const { currentHandleEdge, nodeDefs, setNodes, isUpdatingEdge, setCurrentHandleEdge } =
         useFlowStore.getState();
      if (isUpdatingEdge) return;

      const target = event.target as HTMLElement;
      const isDroppedOnPane = target.classList.contains('react-flow__pane');

      if (isDroppedOnPane) {
         if (!currentHandleEdge) {
            updateNodeInputsAndOutputs(setNodes);
            return;
         }
         const { handleId, handleType, edgeType } = currentHandleEdge;

         // For some reason, need to wait until the next event loop
         await new Promise((resolve) => setTimeout(resolve, 0));

         const suggestionOptions = { nodeDefs, limit: 10, handleType, edgeType, handleId };
         const suggestedNodes = getSuggestedNodesData(suggestionOptions);

         const menuTitle = `${edgeType} | ${edgeType}`;
         onContextMenu(event, suggestedNodes, menuTitle);
      }
      updateNodeInputsAndOutputs(setNodes);

      setCurrentHandleEdge(null);
   };
}

const updateNodeInputsAndOutputs = (setNodes: (nodes: AppNode[]) => void) => {
   const { nodes } = useFlowStore.getState();

   const newNodes = nodes.map((node) => {
      const outputs = { ...node.data.outputs };
      for (const name in outputs) {
         outputs[name].isHighlighted = false;
      }

      const inputs = { ...node.data.inputs };
      for (const name in inputs) {
         inputs[name].isHighlighted = false;
      }

      return {
         ...node,
         data: { ...node.data, outputs, inputs }
      };
   });

   setNodes(newNodes);
};

export function handleOnConnectStart() {
   return (_: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      const { nodes, setNodes, setCurrentHandleEdge } = useFlowStore.getState();
      const node = nodes.find((node) => node.id === params.nodeId);
      if (!node || !params.handleId) return;

      const handleName = getHandleName(params.handleId);
      const handle = node.data[params.handleType === 'source' ? 'outputs' : 'inputs'][handleName];
      if (!handle) return;

      const handleType = params.handleType === 'source' ? 'output' : 'input';
      setCurrentHandleEdge({
         handleId: params.handleId,
         edgeType: handle.edge_type,
         handleType
      });

      let newNodes = nodes;
      if (params.handleType === 'target') {
         newNodes = nodes.map((node) => {
            const outputs = { ...node.data.outputs };
            for (const name in outputs) {
               const output = outputs[name];
               outputs[name].isHighlighted = output.edge_type !== handle.edge_type;
            }

            return {
               ...node,
               data: {
                  ...node.data,
                  outputs
               }
            };
         });
      } else if (params.handleType === 'source') {
         newNodes = nodes.map((node) => {
            const inputs = { ...node.data.inputs };
            for (const name in inputs) {
               const input = inputs[name];
               inputs[name].isHighlighted = input.edge_type !== handle.edge_type;
            }

            return {
               ...node,
               data: {
                  ...node.data,
                  inputs
               }
            };
         });
      }

      setNodes(newNodes);
   };
}

export function validateConnection({ getEdges, getNodes }: ValidateConnectionParams) {
   return (connection: Connection | Edge): boolean => {
      const { source, target, sourceHandle, targetHandle } = connection;
      const nodes = getNodes();
      const edges = getEdges();

      if (sourceHandle === null || targetHandle === null) return false;

      // Find corresponding nodes
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (!sourceNode || !targetNode) return false;

      // Ensure new connection does not introduce a circular loop
      if (target === source) return false;

      if (
         isWidgetType(targetNode.data.inputs[getHandleName(targetHandle!)]?.edge_type) &&
         isPrimitiveNode(sourceNode)
      ) {
         return true;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
         if (visited.has(node.id)) return false;

         visited.add(node.id);

         for (const outgoer of getOutgoers(node, nodes, edges)) {
            if (outgoer.id === source) return true;
            if (hasCycle(outgoer, visited)) return true;
         }
      };

      if (hasCycle(targetNode)) return false;

      const outputHandle = sourceNode.data.outputs[getHandleName(sourceHandle!)];
      const inputHandle = targetNode.data.inputs[getHandleName(targetHandle!)];
      if (!outputHandle || !inputHandle) return false;

      if (sourceNode.type === 'RerouteNode' || targetNode.type === 'RerouteNode') {
         return outputHandle.edge_type != inputHandle.edge_type;
      }

      // Ensure new connection connects compatible types
      return outputHandle.edge_type === inputHandle.edge_type;
   };
}
