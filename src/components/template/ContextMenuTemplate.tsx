import { ContextMenuProps } from "../../types";
import { MouseEvent, useEffect, useRef } from "react";
import { IMenuType } from "./menuData";

export function ContextMenu(prps: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    parentMenu,
    currentSubmenu,
    title,
    items,

    top,
    left,
    bottom,
    right,

    menuIndex,
    onSubmenuClick,

    ...props
  } = prps;

  useEffect(() => {
    setTimeout(function () {
      if (menuRef.current) menuRef.current.style.pointerEvents = "auto";
    }, 100);
  }, []);

  const onItemClick = (
    e: MouseEvent<HTMLDivElement>,
    i: number,
    value: IMenuType,
  ) => {
    // console.log("[onItemClick]", value);

    if (value.hasSubMenu && value.subMenu) {
      onSubmenuClick?.(e, prps, menuRef, menuIndex, value.subMenu);
    } else {
      alert(`Clicked on ${value.label} Node..`)
    }

    if (currentSubmenu) {
      currentSubmenu.close(e);
    }
  };

  const style = {
    ...(top !== undefined ? { top: `${top}px` } : {}),
    ...(left !== undefined ? { left: `${left}px` } : {}),
    ...(right !== undefined ? { right: `${right}px` } : {}),
    ...(bottom !== undefined ? { bottom: `${bottom}px` } : {}),
  };

  return (
    <div className="context-menu" {...props} style={{ ...style }}>
      <div
        ref={menuRef}
        style={{ pointerEvents: "none" }}
        className={"react-flow rflcontextmenu rflmenubar-panel"}
      >
        {title && <div className={"rflmenu-title"}>{title}</div>}

        {items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={(e) => onItemClick(e, index, item)}
              className={`rflmenu-entry submenu ${item === null ? "separator" : (item.subMenu || item.hasSubMenu) && "has_submenu"} ${item.disabled && "disabled"}`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
