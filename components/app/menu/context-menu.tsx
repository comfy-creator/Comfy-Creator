"use client";

import { useContextMenu } from "@/components/providers/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategorizedNodeDefinitions } from "@/lib/data/nodes";
import { useFlow } from "@/lib/stores/flow";

export function ContextMenu() {
  const { position, setIsOpen } = useContextMenu();
  const categNodes = getCategorizedNodeDefinitions();
  const { addNode } = useFlow();

  return (
    <DropdownMenu open={true} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          style={{
            position: "absolute",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "1px",
            height: "1px",
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={0}
        alignOffset={0}
        avoidCollisions={false}
        className="w-48"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Add Node</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48">
              {Object.keys(categNodes).map((category) => {
                return (
                  <>
                    <DropdownMenuLabel>{category}</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {categNodes[category].map((node) => {
                      return (
                        <DropdownMenuItem
                          onClick={() => addNode(node.type, position)}
                        >
                          <span>{node.name}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </>
                );
              })}
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
  );
}
