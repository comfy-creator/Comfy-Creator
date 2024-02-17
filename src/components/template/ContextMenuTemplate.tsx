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
    console.log("[onItemClick]", value.subMenu);

    onSubmenuClick?.(e, prps, menuRef, menuIndex, value.subMenu);
    var close_parent = true;

    if (currentSubmenu) {
      currentSubmenu.close(e);
    }

    //global callback
    // if (options.callback) {
    //   var r = options.callback.call(
    //     this,
    //     value,
    //     options,
    //     e,
    //     that,
    //     options.node,
    //   );
    //   if (r === true) {
    //     close_parent = false;
    //   }
    // }
    //
    // //special cases
    // if (value) {
    //   if (
    //     value.callback &&
    //     !options.ignore_item_callbacks &&
    //     value.disabled !== true
    //   ) {
    //     //item callback
    //     var r = value.callback.call(
    //       this,
    //       value,
    //       options,
    //       e,
    //       that,
    //       options.extra,
    //     );
    //     if (r === true) {
    //       close_parent = false;
    //     }
    //   }
    //   if (value.submenu) {
    //     if (!value.submenu.options) {
    //       throw "ContextMenu submenu needs options";
    //     }
    //     var submenu = new that.constructor(value.submenu.options, {
    //       callback: value.submenu.callback,
    //       event: e,
    //       parentMenu: that,
    //       ignore_item_callbacks: value.submenu.ignore_item_callbacks,
    //       title: value.submenu.title,
    //       extra: value.submenu.extra,
    //       autoopen: options.autoopen,
    //     });
    //     close_parent = false;
    //   }
    // }

    // if (close_parent && !that.lock) {
    //   that.close();
    // }
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
        className={"litegraph litecontextmenu litemenubar-panel"}
      >
        {title && <div className={"litemenu-title"}>{title}</div>}

        {items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={(e) => onItemClick(e, index, item)}
              className={`litemenu-entry submenu ${item === null ? "separator" : (item.subMenu || item.hasSubMenu) && "has_submenu"} ${item.disabled && "disabled"}`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
