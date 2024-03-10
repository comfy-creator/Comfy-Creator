import { ContextMenuProps, IMenuType } from '../../types';
import { MouseEvent, useEffect, useRef } from 'react';
import { useFlowStore } from '../../store/flow';

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
      if (menuRef.current) menuRef.current.style.pointerEvents = 'auto';
    }, 100);
  }, []);

  const onItemClick = (e: MouseEvent<HTMLDivElement>, i: number, value: IMenuType) => {
    // console.log("[onItemClick]", value);

    if (value.hasSubMenu && value.subMenu) {
      onSubmenuClick?.(e, prps, menuRef, menuIndex, value.subMenu);
    } else {
      if (value.onClick) {
        return value.onClick(e);
      }

      const position = { x: e.clientX, y: e.clientY };

      const { addNode } = useFlowStore.getState();
      addNode({
        position,
        type: value.node?.name,
        inputWidgetValues: {}
      });
    }

    if (currentSubmenu) {
      currentSubmenu.close(e);
    }
  };

  const style = {
    ...(top !== undefined ? { top: `${top}px` } : {}),
    ...(left !== undefined ? { left: `${left}px` } : {}),
    ...(right !== undefined ? { right: `${right}px` } : {}),
    ...(bottom !== undefined ? { bottom: `${bottom}px` } : {})
  };

  return (
    <div className="context-menu" {...props} style={{ ...style }}>
      <div
        ref={menuRef}
        style={{ pointerEvents: 'none' }}
        className={'react-flow rflcontextmenu rflmenubar-panel'}
      >
        {title && <div className={'rflmenu-title'}>{title}</div>}

        {items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={(e) => (item ? onItemClick(e, index, item) : undefined)}
              className={`rflmenu-entry submenu ${item === null ? 'separator' : (item.subMenu || item.hasSubMenu) && 'has_submenu'} ${item?.disabled && 'disabled'}`}
            >
              {item?.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
