import { createContext, useContext, useState } from "react";
import { ContextMenu } from "@/components/app/menu/context-menu";

interface ContextMenuProps {
  isOpen: boolean;
  position: UIPosition;
  setIsOpen: (isOpen: boolean) => void;
  setPosition: (position: UIPosition) => void;
}

export function ContextMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [position, setPosition] = useState<UIPosition>({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContextMenuContext.Provider
      value={{ isOpen, position, setIsOpen, setPosition }}
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
