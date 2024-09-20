import { AppNode, EdgeType, HandleState, HandleType, IMenuType, NodeDefinitions } from '../types/types';
import { useFlowStore } from '../store/flow';
import { categorizeObjects } from './ui';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { createEdge, getHandleName, getHandleNodeId, makeHandleId } from './node';
import { NODE_GROUP_NAME } from '../config/constants';

export function getNodeMenuItems(node: AppNode) {
   const items: (IMenuType | null)[] = [
      // { label: 'Inputs', hasSubMenu: true, disabled: true, subMenu: null, data: null },
      // { label: 'Outputs', hasSubMenu: true, disabled: true, subMenu: null, data: null },

      // null,

      // {
      //   label: 'Convert to Group Node',
      //   hasSubMenu: false,
      //   disabled: true,
      //   subMenu: null,
      //   data: null
      // },
      // { label: 'Properties', hasSubMenu: true, disabled: false, subMenu: null, data: null },
      // { label: 'Properties Panel', hasSubMenu: false, disabled: false, subMenu: null, data: null },

      // null,

      { label: 'Title', hasSubMenu: false, disabled: false, subMenu: null, data: null },
      // { label: 'Mode', hasSubMenu: true, disabled: false, subMenu: null, data: null },
      { label: 'Collapse', hasSubMenu: false, disabled: false, subMenu: null, data: null },
      // { label: 'Pin', hasSubMenu: false, disabled: false, subMenu: null, data: null },
      // { label: 'Colors', hasSubMenu: true, disabled: false, subMenu: null, data: null },
      // { label: 'Shapes', hasSubMenu: true, disabled: false, subMenu: null, data: null },

      null,

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
         disabled: false,
         hasSubMenu: false,
         label: 'Add Group',
         onClick: (event: ReactMouseEvent) => {
            console.log('Click>>')
            const position = { x: event.clientX, y: event.clientY };

            state.addNode({ position, type: NODE_GROUP_NAME });
         }
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

interface GetSuggestionsData {
   limit?: number;
   handleId: string;
   edgeType: EdgeType;
   handleType: HandleType;
   nodeDefs: NodeDefinitions;
   onPaneClick: () => void;
}

export function getSuggestedNodesData({
   nodeDefs,
   handleId,
   handleType,
   edgeType,
   limit,
   onPaneClick
}: GetSuggestionsData): IMenuType[] {
   let suggestedNodes = Object.entries(nodeDefs).filter(
      ([_, node]) =>
         Object.entries(node[handleType === 'input' ? 'outputs' : 'inputs']).findIndex(
            ([_, d]) => d.edge_type === edgeType
         ) !== -1
   );

   if (limit) {
      suggestedNodes = suggestedNodes.slice(0, limit);
   }

   return suggestedNodes.map(([type, node]) => ({
      data: node,
      subMenu: null,
      disabled: false,
      hasSubMenu: false,
      label: node.display_name,
      onClick: (e: ReactMouseEvent) => {
         const { addNode, updateInputData, updateOutputData } = useFlowStore.getState();
         const position = { x: e.clientX, y: e.clientY };

         const nodeId = addNode({ position, type });
         const { setEdges, nodes, edges } = useFlowStore.getState();

         const node = nodes.find((node) => node.id === nodeId);
         if (!node) return;

         const key = handleType === 'input' ? 'outputs' : 'inputs';

         const handle = Object.values(node.data[key]).find(
            (handle) => handle.edge_type === edgeType
         );
         if (!handle) return;

         const sourceHandle =
            handleType == 'input' ? makeHandleId(node.id, handle.display_name) : handleId;
         const targetHandle =
            handleType == 'output' ? makeHandleId(node.id, handle.display_name) : handleId;

         const edge = createEdge({ sourceHandle, targetHandle, type: edgeType });

         const pEdge = edges.find((edge) => edge.targetHandle === handleId);

         if (pEdge) {
            updateOutputData({
               nodeId: pEdge.source,
               display_name: getHandleName(pEdge.sourceHandle!),
               data: { isConnected: false }
            });
         }

         setEdges((edges) => {
            const newEdges = edges.filter((edge) => edge.targetHandle !== handleId);
            return [...newEdges, edge];
         });

         onPaneClick?.();

         let inputData: Partial<HandleState> = { isConnected: true };
         // TODO: abstract these away and avoid repetitions
         const sourceNode = nodes.find((node) => node.id === getHandleNodeId(handleId));
         if (sourceNode && sourceNode.type === 'MaskImage') {
            const maskImageValue = sourceNode.data.outputs[getHandleName(handleId)]?.value;
            console.log('Got to this place>>>');
            inputData = { ...inputData, value: maskImageValue }
         }
         updateInputData({
            nodeId: getHandleNodeId(targetHandle),
            display_name: getHandleName(targetHandle),
            data: inputData
         });

         updateOutputData({
            nodeId: getHandleNodeId(sourceHandle),
            display_name: getHandleName(sourceHandle),
            data: { isConnected: true }
         });
      }
   })) as IMenuType[];
}
