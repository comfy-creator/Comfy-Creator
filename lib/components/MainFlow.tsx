// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { DragEvent, useCallback, useEffect, useRef } from 'react';
import {
   ReactFlow,
   Background,
   BackgroundVariant,
   ConnectionLineType,
   ConnectionMode,
   Controls,
   Edge,
   getNodesBounds,
   getViewportForBounds,
   NodeResizer,
   NodeToolbar,
   OnConnectStart,
   Panel,
   useReactFlow
} from '@xyflow/react';
import { useContextMenu } from '../contexts/contextmenu';
import ControlPanel from './panels/ControlPanel';
import { RFState, useFlowStore } from '../store/flow';
import { AppNode } from '../types/types';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../handlers/dragDrop';
import { ConnectionLine } from './ConnectionLIne';
import {
   AUTO_PAN_ON_CONNECT,
   EDGES_UPDATABLE,
   ELEVATE_EDGES_ON_SELECT,
   FLOW_MAX_ZOOM,
   FLOW_MIN_ZOOM,
   HANDLE_TYPES,
   MULTI_SELECT_KEY_CODE,
   REACTFLOW_PRO_OPTIONS_CONFIG,
   SAVE_GRAPH_DEBOUNCE,
   ZOOM_ON_DOUBLE_CLICK
} from '../config/constants';
import { useSettings } from '../contexts/settings';
import { useSettingsStore } from '../store/settings';
import { defaultThemeConfig } from '../config/themes';
import { colorSchemeSettings } from './settings';
import { useApiContext } from '../contexts/api';
import ImageFeedDrawer from './Drawer/ImageFeedDrawer';
import { useGraph } from '../hooks/useGraph';
import { handleOnConnectEnd, handleOnConnectStart, validateConnection } from '../handlers/connect';
import { handleEdgeUpdate, handleEdgeUpdateEnd, handleEdgeUpdateStart } from '../handlers/edge';
import { IGraphData } from '../store/database';
import { useGraphContext } from '../contexts/graph';

const selector = (state: RFState) => ({
   panOnDrag: state.panOnDrag,
   nodes: state.nodes,
   edges: state.edges,
   onNodesChange: state.onNodesChange,
   onEdgesChange: state.onEdgesChange,
   onConnect: state.onConnect,
   setNodes: state.setNodes,
   setEdges: state.setEdges,
   nodeComponents: state.nodeComponents,
   loadNodeDefsFromApi: state.loadNodeDefsFromApi,
   nodeDefs: state.nodeDefs,
   addNode: state.addNode,
   updateInputData: state.updateInputData,
   updateOutputData: state.updateOutputData,
   hotKeysShortcut: state.hotKeysShortcut,
   hotKeysHandlers: state.hotKeysHandlers,
   addHotKeysShortcut: state.addHotKeysShortcut,
   addHotKeysHandlers: state.addHotKeysHandlers,
   setCurrentConnectionLineType: state.setCurrentConnectionLineType,
   edgeComponents: state.edgeComponents,
   registerEdgeType: state.registerEdgeType,
   addRawNode: state.addRawNode,
   executions: state.executions,
   isUpdatingEdge: state.isUpdatingEdge,
   setIsUpdatingEdge: state.setIsUpdatingEdge,
   currentHandleEdge: state.currentHandleEdge,
   setCurrentHandleEdge: state.setCurrentHandleEdge
});

export function MainFlow() {
   const {
      panOnDrag,
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      setNodes,
      setEdges,
      nodeDefs,
      nodeComponents,
      loadNodeDefsFromApi,
      addNode,
      hotKeysShortcut,
      hotKeysHandlers,
      setCurrentConnectionLineType,
      edgeComponents,
      registerEdgeType,
      executions,
      updateInputData,
      updateOutputData,
      isUpdatingEdge,
      setIsUpdatingEdge,
      currentHandleEdge,
      setCurrentHandleEdge
   } = useFlowStore(selector);

   const { currentStateGraphRunIndex, addNewGraph } = useGraphContext();

   const { getNodes, getEdges, getViewport, fitView, screenToFlowPosition } = useReactFlow<
      AppNode,
      Edge
   >();
   const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();
   const { loadCurrentSettings, addSetting } = useSettings();
   const { getNodeDefs, makeServerURL } = useApiContext();
   const { saveSerializedGraph, loadSerializedGraph } = useGraph();

   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      loadNodeDefsFromApi(getNodeDefs);
      loadSerializedGraph();
   }, []);

   // useEffect(() => {
   //   if (!execution.output) return;

   //   const node = nodes.find((node) => node.id === execution.currentNodeId);
   //   if (node?.id !== execution.currentNodeId) return;
   //   const { images } = execution.output;

   //   const fileView = API_URL.VIEW_FILE({ ...images?.[0] });
   //   updateInputData({
   //     name: 'image',
   //     nodeId: node.id,
   //     data: { value: makeServerURL(fileView) }
   //   });
   // }, [execution, nodes, updateInputData, makeServerURL]);

   useEffect(() => {
      const { addThemes } = useSettingsStore.getState();

      // Load current settings
      loadCurrentSettings();

      // Register default color schemes
      addThemes(defaultThemeConfig);
      addSetting(colorSchemeSettings);

      // Register Node definitions and edge types
      registerEdgeType(HANDLE_TYPES);
   }, []);

   useEffect(() => {
      (async () => {
         const graphs = [] as IGraphData[];

         if (graphs.length > 0) {
            const newGraphs = graphs.map((graph) => {
               return {
                  ...graph,
                  nodes: graph.nodes.filter(Boolean),
                  edges: graph.edges.filter(Boolean)
               };
            });

            clearTimeout(debounceTimer?.current ?? '');
            debounceTimer.current = setTimeout(() => {
               saveSerializedGraph(newGraphs);
            }, SAVE_GRAPH_DEBOUNCE);
         }
      })();

      // Clean up function
      return () => {
         clearTimeout(debounceTimer?.current ?? '');
      };
   }, []);

   // TO DO: open the context menu if you dragged out an edge and didn't connect it,
   // so we can auto-spawn a compatible node for that edge
   const onConnectEnd = useCallback(
      handleOnConnectEnd({
         nodeDefs,
         setNodes,
         onContextMenu,
         isUpdatingEdge,
         currentHandleEdge,
         setCurrentHandleEdge
      }),
      [nodes, currentHandleEdge, nodeDefs]
   );

   const onConnectStart: OnConnectStart = useCallback(
      handleOnConnectStart({
         nodes,
         setNodes,
         setCurrentHandleEdge,
         setCurrentConnectionLineType
      }),
      [nodes]
   );

   // Validation connection for edge-compatability and circular loops
   const isValidConnection = useCallback(validateConnection({ getEdges, getNodes }), [
      getNodes,
      getEdges
   ]);

   const onDragOver = useCallback(dragHandler, []);

   const onDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) =>
         dropHandler({ screenToFlowPosition, addNode, setNodes, setEdges })(event),
      [screenToFlowPosition, addNode, setNodes, setEdges]
   );

   const handleKeyPress = useCallback(
      (keyName: string, event: any) => {
         event.preventDefault();
         hotKeysHandlers[keyName]?.();
      },
      [hotKeysHandlers]
   );

   // TO DO: this is aggressive; do not change zoom levels. We do not need to have
   // all nodes on screen at once; we merely do not want to leave too far out
   const onMoveEnd = useCallback(
      (_: MouseEvent | globalThis.TouchEvent | null) => {
         const bounds = getNodesBounds(nodes);
         const viewPort = getViewport();

         const boundViewPort = getViewportForBounds(
            bounds,
            menuRef.current?.clientWidth || 1200,
            menuRef.current?.clientHeight || 800,
            0.7,
            viewPort.zoom,
            0
         );

         if (
            viewPort.x > (menuRef.current?.clientWidth || 0) ||
            viewPort.y > (menuRef.current?.clientHeight || 0)
         ) {
            fitView({
               minZoom: FLOW_MIN_ZOOM,
               maxZoom: viewPort.zoom,
               duration: 500
            });
         }

         if (viewPort.x < 0 && Math.abs(viewPort.x) > boundViewPort.x) {
            fitView({
               minZoom: FLOW_MIN_ZOOM,
               maxZoom: viewPort.zoom,
               duration: 500
            });
         }
      },
      [fitView, nodes, getViewport, menuRef]
   );

   const onEdgeUpdate = useCallback(handleEdgeUpdate({ setIsUpdatingEdge, setEdges }), []);
   const onEdgeUpdateEnd = useCallback(handleEdgeUpdateEnd({ setIsUpdatingEdge }), []);
   const onEdgeUpdateStart = useCallback(
      handleEdgeUpdateStart({
         setIsUpdatingEdge,
         updateOutputData,
         updateInputData,
         setEdges
      }),
      [edges]
   );

   return (
      <ReactFlow
         nodes={nodes}
         edges={edges}
         onConnect={onConnect}
         panOnDrag={panOnDrag}
         edgesReconnectable={EDGES_UPDATABLE}
         autoPanOnConnect={AUTO_PAN_ON_CONNECT}
         onPaneClick={onPaneClick}
         elevateEdgesOnSelect={ELEVATE_EDGES_ON_SELECT}
         onContextMenu={onContextMenu}
         onNodeContextMenu={onNodeContextMenu}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
         connectionMode={ConnectionMode.Loose}
         onConnectStart={(...props) => {
            if (currentStateGraphRunIndex.length > 0) {
               addNewGraph('', { nodes, edges }, true, true);
            }
            onConnectStart(...props);
         }}
         onConnectEnd={(...props) => {
            if (currentStateGraphRunIndex.length > 0) {
               addNewGraph('', { nodes, edges }, true, true);
            }
            onConnectEnd(...props);
         }}
         isValidConnection={isValidConnection}
         nodeTypes={nodeComponents}
         ref={menuRef}
         onDrop={onDrop}
         onDragOver={onDragOver}
         onMoveEnd={onMoveEnd}
         onReconnectEnd={onEdgeUpdateEnd}
         onReconnect={onEdgeUpdate}
         onReconnectStart={onEdgeUpdateStart}
         maxZoom={FLOW_MAX_ZOOM}
         minZoom={FLOW_MIN_ZOOM}
         edgesFocusable={false}
         deleteKeyCode={['Delete', 'Backspace']}
         multiSelectionKeyCode={MULTI_SELECT_KEY_CODE}
         fitView
         fitViewOptions={{
            padding: 2,
            minZoom: 1,
            maxZoom: FLOW_MAX_ZOOM,
            duration: 500
         }}
         zoomOnDoubleClick={ZOOM_ON_DOUBLE_CLICK}
         style={{
            backgroundColor: 'var(--bg-color)',
            color: 'var(--fg-color)',
            cursor: 'crosshair'
         }}
         proOptions={REACTFLOW_PRO_OPTIONS_CONFIG}
         edgeTypes={edgeComponents}
         connectionLineComponent={ConnectionLine}
         connectionLineType={ConnectionLineType.Bezier}
         onPaneContextMenu={onContextMenu}
      >
         <ReactHotkeys keyName={hotKeysShortcut.join(',')} onKeyDown={handleKeyPress}>
            <Background color={'var(--tr-odd-bg-color)'} variant={BackgroundVariant.Lines} />

            <Controls />
            <NodeResizer />
            <NodeToolbar />
            <Panel position="top-right">
               <ControlPanel />
               <ImageFeedDrawer />
            </Panel>
         </ReactHotkeys>
      </ReactFlow>
   );
}
