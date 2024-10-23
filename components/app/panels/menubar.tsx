"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Panel, PanelPosition } from "@xyflow/react";

interface MenubarPanelProps {
  position?: PanelPosition;
}

export function MenubarPanel({ position }: MenubarPanelProps) {
  return (
    <Panel position={position}>
      <Menubar className="border hover:bg-opacity-5">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <FilesMenubarContent />
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Workflows</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </Panel>
  );
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
  );
};
