import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { ContextMenuProps, IMenuType, NodeState } from '../types.ts';
import { ContextMenu } from '../components/template/ContextMenuTemplate.tsx';
import { Node } from 'reactflow';
import SearchWidget from '../components/SearchWidget.tsx';
import NodeDefs from '../../node_info.json';
import { categorizeObjects } from '../utils/ui.tsx';
import { getNodeMenuItems } from '../menu.ts';

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
    throw new Error('ContextMenu must be used within a ContextMenuProvider');
  }

  return context;
}

export function ContextMenuProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [menuProps, setMenuProps] = useState<ContextMenuProps | null>(null);
  const [nodeId, setNodeId] = useState<string | undefined>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);

  const [currentOpenedMenuIndex, setCurrentOpenedMenuIndex] = useState(0);
  const [menus, setMenus] = useState<ContextMenuProps[]>([]);
  const [currentSubmenu, setCurrentSubmenu] = useState<ContextMenuProps | null>(null);

  // state to manage menu dialog
  const [showSearchWidget, setShowSearchWidget] = useState(false);
  const [searchWidgetProps, setSearchWidgetProps] = useState<any>({});
  const searchWidgetRef = useRef<HTMLDivElement>(null);
  const [searchWidgetTimeOutID, setSearchWidgetTimeOutID] = useState<NodeJS.Timeout | null>(null);

  // function for handling double click
  const handleDoubleClick = (event?: MouseEvent) => {
    const widget = searchWidgetRef.current?.getBoundingClientRect();
    if (!widget) return;

    if (event) {
      setSearchWidgetProps({
        top: event.clientY < widget.height - 200 ? event.clientY : undefined,
        left: event.clientX < widget.width - 200 ? event.clientX : undefined,
        right: event.clientX >= widget.width - 200 ? widget.width - event.clientX : undefined,
        bottom: event.clientY >= widget.height - 200 ? widget.height - event.clientY : undefined
      });
    }
    setShowSearchWidget(true);
  };

  // function for mouse over
  const handleMouseLeave = () => {
    const timeOutID = setTimeout(() => {
      setShowSearchWidget(false);
    }, 1000);
    setSearchWidgetTimeOutID(timeOutID);
  };

  const handleMouseIn = () => {
    if (searchWidgetTimeOutID) {
      clearTimeout(searchWidgetTimeOutID);
    }
    setShowSearchWidget(true);
  };

  useEffect(() => {
    menuRef?.current?.addEventListener('dblclick', (event) => {
      handleDoubleClick(event);
      return;
    });
    return () => {
      menuRef?.current?.removeEventListener('dblclick', () => {
        handleDoubleClick();
      });
    };
  }, []);

  const onContextMenu = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      const menuData = getMenuData(event, categorizeObjects(NodeDefs));
      if (!menuData) return;

      // console.log('event>', evewnt);

      console.log('from pane context menu');
      // setMenuProps(menuData);
    },
    [nodeId, setMenuProps, setNodeId]
  );

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node<NodeState>) => {
      event.preventDefault();

      const menuData = getMenuData(event, getNodeMenuItems(node));
      if (!menuData) return;

      console.log('from node context menu');
      setMenuProps(menuData);
      setNodeId(node.id);
    },
    [setMenuProps, setNodeId]
  );

  const getMenuData = (event: ReactMouseEvent, items?: (IMenuType | null)[]) => {
    const pane = menuRef.current?.getBoundingClientRect();
    if (!pane) return;

    return {
      top: event.clientY < pane.height - 200 ? event.clientY : undefined,
      left: event.clientX < pane.width - 200 ? event.clientX : undefined,
      right: event.clientX >= pane.width - 200 ? pane.width - event.clientX : undefined,
      bottom: event.clientY >= pane.height - 200 ? pane.height - event.clientY : undefined,
      items: items
    } as ContextMenuProps;
  };

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => {
    console.log('Clicking>>>');
    setMenuProps(null);
    setCurrentOpenedMenuIndex(0);
    setMenus([]);
    setCurrentSubmenu(null);
    setShowSearchWidget(false);
  }, [setMenuProps, setCurrentOpenedMenuIndex, setMenus, setCurrentSubmenu, setShowSearchWidget]);

  const reset = () => {
    setMenuProps(null);
    setNodeId(undefined);
  };

  const onSubContextMenu = (
    event: ReactMouseEvent,
    parentMenu: ContextMenuProps,
    parentMenuRef: RefObject<HTMLDivElement>,
    parentMenuIndex: number,
    items: IMenuType[] = []
  ) => {
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
      top: rect ? rect.top : undefined
    });
    setCurrentOpenedMenuIndex(parentMenuIndex);
  };

  return (
    <ContextMenuContext.Provider
      value={{
        onContextMenu,
        onNodeContextMenu,
        onPaneClick,
        menuRef
      }}
    >
      {children}

      <SearchWidget
        handleMouseLeave={handleMouseLeave}
        handleMouseIn={handleMouseIn}
        show={showSearchWidget}
        widgetRef={searchWidgetRef}
        props={searchWidgetProps}
      />

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
