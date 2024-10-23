"use client";

import { useFileManager } from "@/components/providers/file-manager";
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
          <MenubarTrigger>Help</MenubarTrigger>
          <HelpMenubarContent />
        </MenubarMenu>
      </Menubar>
    </Panel>
  );
}

const FilesMenubarContent = () => {
  const { handleOpenFile } = useFileManager();

  return (
    <MenubarContent>
      <MenubarItem onClick={handleOpenFile}>
        Open... <MenubarShortcut>⌘O</MenubarShortcut>
      </MenubarItem>

      <MenubarItem>
        New Workflow <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleOpenFile}>
        Duplicate Workflow <MenubarShortcut>⌘D</MenubarShortcut>
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

const HelpMenubarContent = () => {
  const openDocs = () => {
    window.open("https://docs.cozy.art", "_blank");
  };

  const openCozyArt = () => {
    window.open("https://cozy.art", "_blank");
  };

  const openFAQs = () => {
    window.open("https://docs.cozy.art/faqs", "_blank");
  };

  return (
    <MenubarContent>
      <MenubarItem onClick={openDocs}>Docs</MenubarItem>
      <MenubarItem onClick={openFAQs}>FAQs</MenubarItem>
      <MenubarItem onClick={openCozyArt}>Cozy Art</MenubarItem>
    </MenubarContent>
  );
};
