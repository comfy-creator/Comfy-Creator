// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { DragEvent, useCallback, useEffect, useRef, useState } from 'react';
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
import { dragHandler, dropHandler, useDragNode } from '../handlers/dragDrop';
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
   ZOOM_ON_DOUBLE_CLICK
} from '../config/constants';
import { useSettings } from '../contexts/settings';
import { useSettingsStore } from '../store/settings';
import { defaultThemeConfig } from '../config/themes';
import { colorSchemeSettings } from './settings';
import { useApiContext } from '../contexts/api';
import { useGraph } from '../hooks/useGraph';
import { handleOnConnectEnd, handleOnConnectStart, validateConnection } from '../handlers/connect';
import { handleEdgeUpdate, handleEdgeUpdateEnd, handleEdgeUpdateStart } from '../handlers/edge';
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
   setIsUpdatingEdge: state.setIsUpdatingEdge,
   addNodeDefComponent: state.addNodeDefComponent,
   refValueNodes: state.refValueNodes,
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
      nodeComponents,
      loadNodeDefsFromApi,
      addNode,
      hotKeysShortcut,
      hotKeysHandlers,
      edgeComponents,
      registerEdgeType,
      updateInputData,
      updateOutputData,
      setIsUpdatingEdge,
      addNodeDefComponent,
      refValueNodes
   } = useFlowStore(selector);

   const { currentSnapshotIndex, addNewGraph } = useGraphContext();

   const { getNodes, getEdges, getViewport, fitView, screenToFlowPosition } = useReactFlow<
      AppNode,
      Edge
   >();
   const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();
   const { loadCurrentSettings, addSetting } = useSettings();
   const { getNodeDefs, appConfig, getNodeComponents } = useApiContext();

   const { loadSerializedGraph } = useGraph();

   const debounceTimer = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      loadNodeDefsFromApi(getNodeDefs);
      loadSerializedGraph();

      getNodeComponents().then(async (res: any) => {
         for (const key in res) {
            const blob = new Blob([res[key]], { type: 'text/javascript' });
            const moduleUrl = URL.createObjectURL(blob);
            const { component } = await loadMicrofrontend(key, moduleUrl);
            addNodeDefComponent(key, component.default || component);
         }
      });
   }, [appConfig.serverUrl, appConfig.server]);

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

   const onConnectEnd = useCallback(handleOnConnectEnd({ onContextMenu, onPaneClick }), [onContextMenu, onPaneClick]);

   const onConnectStart: OnConnectStart = useCallback(handleOnConnectStart(), [nodes]);

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
         setEdges,
         refValueNodes,
         nodes
      }),
      [edges, setEdges, nodes]
   );

   const { onNodeDrag, onMouseUp } = useDragNode();

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
            // if the current graph is a snapshot, add a new graph 
            // (with the nodes and edges since they want to continue with it) becasue they can't edit snapshots
            if (currentSnapshotIndex.length > 0) {
               addNewGraph('', { nodes, edges }, true, true);
            }
            onConnectStart(...props);
         }}
         onConnectEnd={(...props) => {
            // if the current graph is a snapshot, add a new graph
            // (with the nodes and edges since they want to continue with it) becasue they can't edit snapshots
            if (currentSnapshotIndex.length > 0) {
               addNewGraph('', { nodes, edges }, true, true);
            }
            onConnectEnd(...props);
         }}
         isValidConnection={isValidConnection}
         nodeTypes={nodeComponents}
         ref={menuRef}
         onDrop={onDrop}
         onDragOver={onDragOver}
         onNodeDrag={(e, node, nodes) => {
            onNodeDrag({ nodes: nodes as AppNode[] });
         }}
         onNodeDragStop={onMouseUp}
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
         // onEdgeClick={onEdgeClick}
      >
         <ReactHotkeys keyName={hotKeysShortcut.join(',')} onKeyDown={handleKeyPress}>
            <Background color={'var(--tr-odd-bg-color)'} variant={BackgroundVariant.Lines} />
            <Controls />
            <NodeResizer />
            <NodeToolbar />
            <Panel position="top-right">
               <ControlPanel />
            </Panel>
         </ReactHotkeys>
      </ReactFlow>
   );
}

const loadMicrofrontend = (id: string, url: string): Promise<{ component: any }> => {
   return new Promise((resolve, reject) => {
      const scriptId = `${id}Node`;
      const existingScript = document.getElementById(scriptId);

      const handleLoad = () => {
         if (window[id as any]) {
            resolve({ component: window[id as any] });
         } else {
            reject(new Error(`component ${id} did not load correctly`));
         }
      };

      if (existingScript) {
         existingScript.addEventListener('load', handleLoad);
         return () => existingScript.removeEventListener('load', handleLoad);
      } else {
         const script = document.createElement('script');
         script.id = scriptId;
         script.src = url;
         script.onload = handleLoad;
         script.onerror = () => reject(new Error(`Failed to load script for component ${id}`));
         document.body.appendChild(script);
      }
   });
};