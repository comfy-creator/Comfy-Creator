import { ContextMenuProps } from "../../types";
import { Node, useReactFlow } from "reactflow";
import { useCallback, useEffect, useState } from "react";
import Menu, { IMenuType } from "./menuData";

// const renderMenu = (menuItems: IMenuType[]) => {
//   const handleOpen = () => {

//   }
//   return menuItems.map((menuItem: IMenuType, index) => (
//     <div key={index} className={`litemenu-entry submenu ${menuItem.hasSubMenu && "has_submenu"}`}>
//       {menuItem.label}
//       {menuItem.subMenu && menuItem?.isOpen && (
//         <div className="litegraph litecontextmenu litemenubar-panel">
//           {renderMenu(menuItem.subMenu)}
//         </div>
//       )}
//     </div>
//   ));
// };

const renderMenu = (
  menuItems: IMenuType[],
  parentIndex: string = "",
  setMenu: any
) => {
  const handleOpen = (index: string) => {
    setMenu((currentMenu: any) => {
      const updateMenuItems = (
        items: IMenuType[],
        indexPath: string[]
      ): IMenuType[] => {
        return items.map((item, idx) => {
          const currentIndex = [...indexPath, idx.toString()].join("-");
          if (item.hasSubMenu && item.subMenu) {
            const isOpen = currentIndex === index;
            return {
              ...item,
              isOpen,
              subMenu: updateMenuItems(item.subMenu, [
                ...indexPath,
                idx.toString(),
              ]),
            };
          }
          return item;
        });
      };

      return updateMenuItems(currentMenu, []);
    });
  };

  return menuItems.map((menuItem: IMenuType, index) => (
    <>
      <div className="litegraph litecontextmenu litemenubar-panel">
        <div
          key={index}
          className={`litemenu-entry submenu ${menuItem.hasSubMenu ? "has_submenu" : ""}`}
          onClick={() =>
            menuItem.hasSubMenu &&
            handleOpen(`${parentIndex}${parentIndex ? "-" : ""}${index}`)
          }
        >
          {menuItem.label}
        </div>
      </div>

      
      {menuItem.subMenu && menuItem.isOpen && (
        <div className="litegraph litecontextmenu litemenubar-panel">
          {renderMenu(
            menuItem.subMenu,
            `${parentIndex}${parentIndex ? "-" : ""}${index}`,
            setMenu
          )}
        </div>
      )}
    </>
  ));
};

export function ContextMenuTemplate({
  id,
  top,
  left,
  right,
  bottom,
  reset,
  ...props
}: ContextMenuProps) {
  const [menu, setMenu] = useState<IMenuType[]>([]);
  const { getNode, getNodes, addNodes, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    const updateMenuItems = (items: IMenuType[]): IMenuType[] => {
      return items.map((item) => {
        if (item.hasSubMenu && item.subMenu) {
          return {
            ...item,
            isOpen: false,
            subMenu: updateMenuItems(item.subMenu), // Recursively update submenus
          };
        }
        return item;
      });
    };

    const newMenu = updateMenuItems(Menu);
    setMenu(newMenu);
  }, []);

  const addNewNode = useCallback(() => {
    let node: Node | undefined;
    if (id) {
      node = getNode(id);
    }

    const newId = getNodes().length + 1;
    const position = node
      ? { x: node.position.x + 50, y: node.position.y + 50 }
      : { x: (top || 0) + 250, y: (left || 0) + 250 };

    addNodes({
      position,
      id: String(newId),
      data: { label: `Node ${newId}` },
    });
  }, [id, getNode, getNodes, addNodes, top, left]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));

    reset?.();
  }, [id, setNodes, setEdges, reset]);

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <div
      style={{
        ...(top !== undefined ? { top: `${top}px` } : {}),
        ...(left !== undefined ? { left: `${left}px` } : {}),
        ...(right !== undefined ? { right: `${right}px` } : {}),
        ...(bottom !== undefined ? { bottom: `${bottom}px` } : {}),
      }}
      className="context-menu"
      {...props}
    >
      <div>
        <h4>{id ? `Node: ${id}` : "Action Menu"}</h4>
        <hr />
      </div>

      <button onClick={addNewNode}>Add Node</button>
      {id && <button onClick={deleteNode}>Remove Node</button>}
      <div>
        {renderMenu(menu, "", setMenu)}
      </div>
    </div>
  );
}
