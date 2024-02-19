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
import { ContextMenu } from "../components/template/ContextMenuTemplate.tsx";
import { Node } from "reactflow";
import Menu, { IMenuType } from "../components/template/menuData.ts";

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

  const [currentOpenedMenuIndex, setCurrentOpenedMenuIndex] = useState(0);
  const [menus, setMenus] = useState<ContextMenuProps[]>([]);
  const [currentSubmenu, setCurrentSubmenu] = useState<ContextMenuProps | null>(
    null,
  );

  const onContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const menuData = getMenuData(event, Menu);
      if (!menuData) return;

      console.log("Event>>", menuData);

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

  const getMenuData = (event: ReactMouseEvent, items?: IMenuType[]) => {
    const pane = menuRef.current?.getBoundingClientRect();
    if (!pane) return;

    return {
      top: event.clientY < pane.height - 200 ? event.clientY : undefined,
      left: event.clientX < pane.width - 200 ? event.clientX : undefined,
      right:
        event.clientX >= pane.width - 200
          ? pane.width - event.clientX
          : undefined,
      bottom:
        event.clientY >= pane.height - 200
          ? pane.height - event.clientY
          : undefined,
      items: items,
    } as ContextMenuProps;
  };

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenuProps(null), [setMenuProps]);

  const reset = () => {
    setMenuProps(null);
    setNodeId(null);
  };

  const onSubContextMenu = (
    event: ReactMouseEvent,
    parentMenu: ContextMenuProps,
    parentMenuRef: RefObject<HTMLDivElement>,
    parentMenuIndex: number,
    items: IMenuType[] = [],
  ) => {
    // console.log("onSubContextMenu", parentMenuIndex);
    event.preventDefault();
    const submenuData = getMenuData(event, items);
    if (!submenuData) return;

    // console.log(parentMenuIndex, parentMenu);
    // console.log({ parentMenuIndex, currentOpenedMenuIndex });

    if (currentOpenedMenuIndex > parentMenuIndex) {
      setMenus((menus) => {
        return menus.slice(0, parentMenuIndex);
      });
    } else {
      if (parentMenuIndex > 0) {
        setMenus((menus) => {
          return [...menus, parentMenu];
        });
      }
    }

    const rect = parentMenuRef.current?.getBoundingClientRect();
    setCurrentSubmenu({
      ...submenuData,
      left: rect ? rect.left + rect.width : undefined,
      top: rect ? rect.top : undefined,
    });
    setCurrentOpenedMenuIndex(parentMenuIndex);
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
        <ContextMenu
          id={nodeId}
          reset={reset}
          menuIndex={0}
          {...menuProps}
          onSubmenuClick={onSubContextMenu}
        />
      )}

      {menus.map((menu, i) => (
        <ContextMenu
          key={i}
          {...menu}
          reset={reset}
          menuIndex={i + 1}
          onSubmenuClick={onSubContextMenu}
        />
      ))}

      {currentSubmenu && (
        <ContextMenu
          menuIndex={menus.length + 1}
          id={nodeId}
          reset={reset}
          {...currentSubmenu}
          onSubmenuClick={onSubContextMenu}
        />
      )}
    </ContextMenuContext.Provider>
  );
}
