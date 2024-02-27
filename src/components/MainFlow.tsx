// Note: SOURCE = output, TARGET = input. Yes; this is confusing

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    MiniMap,
    Node,
    NodeResizer,
    NodeToolbar,
    Panel,
    ReactFlowInstance,
    useReactFlow,
    getOutgoers,
    OnConnectEnd
} from 'reactflow';
import { useContextMenu } from '../contexts/ContextMenu';
import ControlPanel from './ControlPanel/ControlPanel';
import { useStore, RFState } from '../store';
import { NodeState } from '../types';
import { previewImage, previewVideo } from '../node_definitions/preview';
import ReactHotkeys from 'react-hot-keys';
import { dragHandler, dropHandler } from '../handlers/dragDrop';

const FLOW_KEY = 'flow';

const selector = (state: RFState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    nodeComponents: state.nodeComponents,
    addNodeDefs: state.addNodeDefs,
    addNode: state.addNode,
    updateWidgetState: state.updateWidgetState,
    hotKeysShortcut: state.hotKeysShortcut,
    hotKeysHandlers: state.hotKeysHandlers,
    addHotKeysShortcut: state.addHotKeysShortcut,
    addHotKeysHandlers: state.addHotKeysHandlers,
});

export function MainFlow() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        setNodes,
        setEdges,
        nodeComponents,
        addNodeDefs,
        addNode,
        hotKeysShortcut,
        hotKeysHandlers,
        addHotKeysShortcut,
        addHotKeysHandlers
    } = useStore(selector);

    const { getNodes, getEdges } = useReactFlow<NodeState, string>();
    const { onContextMenu, onNodeContextMenu, onPaneClick, menuRef } = useContextMenu();

    const [rfInstance, setRFInstance] = useState<ReactFlowInstance | null>(null);

    useEffect(() => {
        // Register some node defs for testing
        addNodeDefs({ previewImage, previewVideo });
    }, []);

    // Store graph state to local storage
    const serializeGraph = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
        }
    }, [rfInstance]);

    // Load graph state from local storage
    const loadGraph = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(FLOW_KEY) || '');

            if (flow) {
                // const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                // setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes, setEdges]);

    // TO DO: open the context menu if you dragged out an edge and didn't connect it,
    // so we can auto-spawn a compatible node for that edge
    const oncConnectEnd: OnConnectEnd = useCallback((event: MouseEvent | TouchEvent) => {
        console.log('onConnectEnd', event);
    }, []);

    // Validation connection for edge-compatability and circular loops
    const isValidConnection = useCallback(
        (connection: Connection): boolean => {
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

            const hasCycle = (node: Node, visited = new Set()) => {
                if (visited.has(node.id)) return false;

                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            if (hasCycle(targetNode)) return false;

            // Ensure new connection connects compatible types
            const sourceEdgeType = sourceNode.data.outputEdges[Number(sourceHandle)].edgeType;
            const targetEdgeType = targetNode.data.inputEdges[Number(targetHandle)].edgeType;
            return sourceEdgeType === targetEdgeType;
        },
        [getNodes, getEdges]
    );

    const onDragOver = useCallback(dragHandler, []);

    const onDrop = useCallback(dropHandler({ rfInstance, addNode, setNodes, setEdges }), [
        rfInstance
    ]);

    const handleKeyPress = useCallback((keyName: string, event: any) => {
        event.preventDefault()
        const func = hotKeysHandlers[keyName];
        func && func();
    }, [hotKeysHandlers]);

    return (
        <ReactFlow
            onContextMenu={onContextMenu}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={onPaneClick}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectEnd={oncConnectEnd}
            isValidConnection={isValidConnection}
            onInit={setRFInstance}
            nodeTypes={nodeComponents}
            ref={menuRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            zoomOnDoubleClick={false}
            style={{
                backgroundColor: 'var(--bg-color)',
                color: 'var(--fg-color)'
            }}
        >
            <ReactHotkeys keyName={hotKeysShortcut.join(',')} onKeyDown={handleKeyPress}>
                <Background variant={BackgroundVariant.Lines} />
                <Controls />
                <MiniMap />
                <NodeResizer />
                <NodeToolbar />
                <Panel position="top-right">
                    <ControlPanel />
                </Panel>
            </ReactHotkeys>
        </ReactFlow>
    );
}
