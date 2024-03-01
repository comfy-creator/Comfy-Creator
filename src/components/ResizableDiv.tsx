import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

const ResizableDiv = ({ className, children }: { className?: string; children: ReactNode }) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);

  const resizableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const debouncedHandleMouseMove = debounce(handleMouseMove, 10);

    document.addEventListener('mousemove', debouncedHandleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', debouncedHandleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, initialX, initialY]);

  const handleMouseDown = (_e: MouseEvent<HTMLDivElement>) => {
    if (!resizableDivRef.current) return;

    setIsResizing(true);
    setInitialX(resizableDivRef.current.offsetWidth);
    setInitialY(resizableDivRef.current.offsetHeight);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isResizing) return;

    const newWidth = initialX + (e.clientX - initialX);
    const newHeight = initialY + (e.clientY - initialY);

    // Set minimum and maximum size
    const minSize = 50;
    const maxSize = 500;

    if (newWidth < minSize) return;
    if (newHeight < minSize) return;
    if (newWidth > maxSize) return;
    if (newHeight > maxSize) return;

    requestAnimationFrame(() => {
      setWidth(newWidth);
      setHeight(newHeight);
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const resizeHandles = [
    {
      id: 'top-left',
      cursor: 'nwse-resize',
      position: {
        top: 0,
        left: 0
      }
    },
    {
      id: 'top-right',
      cursor: 'nesw-resize',
      position: {
        top: 0,
        right: 0
      }
    },
    {
      id: 'bottom-left',
      cursor: 'nwse-resize',
      position: {
        bottom: 0,
        left: 0
      }
    },
    {
      id: 'bottom-right',
      cursor: 'nesw-resize',
      position: {
        bottom: 0,
        right: 0
      }
    }
    // Add more handles as needed
  ];

  return (
    <div
      ref={resizableDivRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        // position: 'absolute',
        backgroundColor: 'lightblue'
      }}
      className={className}
      role="region"
      aria-label="Resizable div"
    >
      {children}
      {resizeHandles.map((handle) => (
        <div
          key={handle.id}
          style={{
            width: '20px',
            height: '20px',
            position: 'absolute',
            backgroundColor: 'blue',
            cursor: handle.cursor,
            ...handle.position
          }}
          onMouseDown={handleMouseDown}
          role="button"
          aria-label="Resize handle"
        />
      ))}
    </div>
  );
};

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export default ResizableDiv;
