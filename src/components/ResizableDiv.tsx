import React, { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';

interface ResizableDivProps {
  className?: string;
  children: ReactNode;
  defaultWidth: string | number;
  defaultHeight: string | number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;

  other?: Record<string, any>;
}

export const ResizableDiv = ({
  defaultWidth,
  defaultHeight,
  className,
  children,
  onClick,
  ...other
}: ResizableDivProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);

  const resizableDivRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    if (handleRef.current) {
      handleRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      if (handleRef.current) {
        handleRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);

  useEffect(() => {
    const handler = debounce(handleMouseMove, 10);

    if (isResizing) {
      document.addEventListener('mousemove', handler);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handler);
      document.addEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, initialX, initialY]);

  const handleMouseDown = () => {
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

  return (
    <div
      {...other}
      onClick={onClick}
      className={className}
      ref={resizableDivRef}
      style={{
        width: `${isNaN(Number(width)) ? width : `${width}px`}`,
        height: `${isNaN(Number(height)) ? height : `${height}px`}`
      }}
    >
      {children}

      <div
        ref={handleRef}
        style={{
          width: '10px',
          height: '10px',
          position: 'absolute',
          cursor: 'se-resize',
          bottom: 0,
          right: 0
        }}
      />
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
