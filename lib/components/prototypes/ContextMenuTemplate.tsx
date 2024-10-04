import { ContextMenuProps, IMenuType } from '../../types/types';
import { MouseEvent, useEffect, useRef } from 'react';

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
      if (value.hasSubMenu && value.subMenu?.length) {
         onSubmenuClick?.(e, prps, menuRef, menuIndex, value.subMenu);
      } else {
         if (value.onClick) {
            return value.onClick(e);
         }
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
         {title && <div>{title}</div>}

         <div
            ref={menuRef}
            style={{ pointerEvents: 'none' }}
         >
            {items.map((item, index) => {
               return (
                  <div
                     key={index}
                     onClick={(e) => (item ? onItemClick(e, index, item) : undefined)}
                     className={`text-[12px] text-[#aaa] p-[2px] m-[2px] select-none cursor-pointer hover:bg-[#444] hover:text-[#eee] ${item === null ? 'block border-b border-[#666] w-full h-0 my-[3px] mb-[2px] bg-transparent p-0 cursor-default hover:bg-none' : item.hasSubMenu && 'border-r-2 border-[#00ffff] relative pr-[20px]'} ${item?.disabled && 'opacity-50 cursor-default'}`}
                  >
                     {item && item.hasSubMenu && (
                        <span className="absolute top-0 right-[2px]">&gt;</span>
                     )}
                     {item?.label}
                  </div>
               );
            })}
         </div>
      </div>
   );
}