import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { ContextMenuProps } from "../types.ts";
import { ContextMenuTemplate } from "../components/template/ContextMenuTemplate.tsx";
import { Node } from "reactflow";

interface IContextMenu {
  onNodeContextMenu: (event: ReactMouseEvent, node: Node) => void;
  onContextMenu: (event: ReactMouseEvent) => void;
  menuRef: RefObject<HTMLDivElement>;
  onPaneClick: () => void;
}

const ContextMenuContext = createContext<IContextMenu | null>(null);

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu must be used within a ContextMenuProvider");
  }

  return context;
}

export function ContextMenuProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [menuProps, setMenuProps] = useState<ContextMenuProps | null>(null);
  const [nodeId, setNodeId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const onContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const menuData = getMenuData(event);
      if (!menuData) return;

      console.log("Event>>", menuData)

      setMenuProps(menuData);
    },
    [setMenuProps],
  );

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      const menuData = getMenuData(event);
      if (!menuData) return;

      setMenuProps(menuData);
      setNodeId(node.id);
    },
    [setMenuProps],
  );

  const getMenuData = (event: ReactMouseEvent) => {
    const pane = menuRef.current?.getBoundingClientRect();
    if (!pane) return;

    return {
      top: event.clientY < pane.height - 200 ? event.clientY : undefined,
      left: event.clientX < pane.width - 200 ? event.clientX : undefined,
      right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
      bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
    };
  };

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenuProps(null), [setMenuProps]);

  const reset = () => {
    setMenuProps(null);
    setNodeId(null);
  };

  return (
    <ContextMenuContext.Provider
      value={{
        onContextMenu,
        onNodeContextMenu,
        onPaneClick,
        menuRef,
      }}
    >
      {children}
      {menuProps && (
        <ContextMenuTemplate reset={reset} id={nodeId} {...menuProps} />
      )}
    </ContextMenuContext.Provider>
  );
}
