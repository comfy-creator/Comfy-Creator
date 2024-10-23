"use client";

import { createContext, useContext, useEffect, useRef } from "react";

interface FileManagerProps {
  handleOpenFile: () => void;
}

export function FileManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!fileInputRef.current) return;

    fileInputRef.current.onchange = () => {
      const files = fileInputRef.current?.files ?? [];
      alert(`File selected: ${files[0].name}`);
    };
  }, [fileInputRef]);

  const handleOpenFile = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <FileManagerContext.Provider
      value={{
        handleOpenFile,
      }}
    >
      {children}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json,image/png,.latent,.safetensors,image/webp"
      />
    </FileManagerContext.Provider>
  );
}

const FileManagerContext = createContext<FileManagerProps | null>(null);

export function useFileManager() {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error("FileManager must be used within a FileManagerProvider");
  }

  return context;
}
