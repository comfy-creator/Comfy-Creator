"use client";

import {
  createContext,
  MouseEvent,
  useCallback,
  useContext,
  useState,
} from "react";
import { ContextMenu } from "@/components/app/menu/context-menu";
import { useReactFlow } from "@xyflow/react";
import { UIPosition } from "@/lib/types";

interface ContextMenuProps {
  isOpen: boolean;
  position: UIPosition;
  closeContextMenu: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setPosition: (position: UIPosition) => void;
  onContextMenu: (e?: MouseEvent<HTMLDivElement>) => void;
}

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [position, setPosition] = useState<UIPosition>({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const { getViewport } = useReactFlow();
  const { x: viewportX, y: viewportY } = getViewport();

  const onContextMenu = useCallback((e?: MouseEvent<HTMLDivElement>) => {
    if (!e) return;
    e.preventDefault();

    setIsOpen(true);
    setPosition({
      x: e.clientX - viewportX,
      y: e.clientY - viewportY,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setIsOpen(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <ContextMenuContext.Provider
      value={{
        isOpen,
        position,
        setIsOpen,
        setPosition,
        onContextMenu,
        closeContextMenu,
      }}
    >
      {children}
      {isOpen && <ContextMenu />}
    </ContextMenuContext.Provider>
  );
}

const ContextMenuContext = createContext<ContextMenuProps | null>(null);

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu must be used within a ContextMenuProvider");
  }

  return context;
}
