"use client"

import { Button } from '@/components/ui/button';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from '@/components/ui/menubar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Connection, Controls, Edge, EdgeChange, Node, NodeChange, Panel, ReactFlow, useReactFlow } from '@xyflow/react';
import { CopyIcon, Layers, PlayIcon } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getCategorizedNodes } from '@/lib/data/nodes';
import { CozyNode } from '@/components/nodes/cozy-node';


export default function Page() {
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
  const { getZoom, getViewport } = useReactFlow();
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { x: viewportX, y: viewportY } = getViewport();
  const categNodes = getCategorizedNodes()

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [customNodes, setCustomNodes] = useState<Record<string, any>>({});

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onContextMenu = useCallback((event) => {
    event.preventDefault();

    setContextMenu({
      x: event.clientX - viewportX,
      y: event.clientY - viewportY,
    });
  }, [getZoom]);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        closeContextMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeContextMenu]);

  const addNode = (type: string) => {
    if (contextMenu) {
      const newNode: Node = {
        id: `node_${nodes.length + 1}`,
        position: contextMenu,
        data: { label: `Node ${nodes.length + 1}` },
        type: type ?? 'default', // or any custom node type you have
      };

      console.log(customNodes);
      console.log(newNode)
      console.log(nodes)

      setNodes((nds) => [...nds, newNode]);
    }
  }

  useEffect(() => {
    const customNodes: Record<string, any> = {}

    for (const category in categNodes) {
      console.log(categNodes[category], category)
      for (const node of categNodes[category]) {
        console.log(node.type)
        customNodes[node.type] = memo(CozyNode(node))
      }
    }

    console.log(customNodes)
    setCustomNodes(customNodes)
  }, [])

  return (
    <div className='h-[100vh] w-full'>
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={customNodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onContextMenu={onContextMenu}
      >
        <Background />
        <Controls />

        <Panel position="top-left">
          <Menubar className='border hover:bg-opacity-5'>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <FilesMenubarContent />
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Workflows</MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </Panel>

        <Panel position="top-right">
          <div className='flex items-center gap-2'>
            <Button size="sm" variant="secondary" className='gap-2'>
              <Layers />
              <span>Nodes</span>
            </Button>

            <Button size="sm" variant="secondary" className='gap-2'>
              <CopyIcon />
              <span>Duplicate</span>
            </Button>

            <Button size="sm" variant="secondary" className='gap-2'>
              <PlayIcon />
              <span>Run</span>
            </Button>
          </div>
        </Panel>
      </ReactFlow>

      {contextMenu && (
        <DropdownMenu open={true} onOpenChange={closeContextMenu}>
          <DropdownMenuTrigger asChild>
            <div
              style={{
                position: 'absolute',
                left: `${contextMenu.x}px`,
                top: `${contextMenu.y}px`,
                width: '1px',
                height: '1px',
              }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="start"
            sideOffset={0}
            alignOffset={0}
            avoidCollisions={false}
            className='w-48'
          >
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Add Node
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='w-48'>
                  {
                    Object.keys(categNodes).map(category => {
                      return (
                        <>
                          <DropdownMenuLabel>{category}</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {
                            categNodes[category].map(node => {
                              return (
                                <DropdownMenuItem onClick={() => addNode(node.type)}>
                                  <span>{node.name}</span>
                                </DropdownMenuItem>
                              )
                            })
                          }
                        </>
                      )
                    })
                  }
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem>Open Template</DropdownMenuItem>
            <DropdownMenuItem>Save Workflow</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

const FilesMenubarContent = () => {
  return (
    <MenubarContent>
      <MenubarItem>
        Open... <MenubarShortcut>⌘O</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        New Workflow <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarSub>
        <MenubarSubTrigger>Share</MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarItem>Copy Link</MenubarItem>
        </MenubarSubContent>
      </MenubarSub>
    </MenubarContent>
  )
}
