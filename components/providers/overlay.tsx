"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { NodesSheet } from "../app/sheets/nodes";
import { on } from "events";

type OverlayKeys = "nodes-sheet";

interface OverlayProps {
  open: (key: string) => void;
  close: (key: string) => void;
}

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const initialState: Record<OverlayKeys, boolean> = { "nodes-sheet": false };
  const [isOpen, setIsOpen] =
    useState<Record<OverlayKeys, boolean>>(initialState);

  const open = (key: string) => {
    setIsOpen((prev) => ({ ...prev, [key]: true }));
  };

  const close = (key: string) => {
    setIsOpen((prev) => ({ ...prev, [key]: false }));
  };

  const setOpen = (key: string, open: boolean) => {
    setIsOpen((prev) => ({ ...prev, [key]: open }));
  };

  return (
    <OverlayContext.Provider value={{ open, close }}>
      {children}

      <NodesSheet
        open={isOpen["nodes-sheet"]}
        onOpenChange={(open) => setOpen("nodes-sheet", open)}
      />
    </OverlayContext.Provider>
  );
}

const OverlayContext = createContext<OverlayProps | null>(null);

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("Overlay must be used within a OverlayProvider");
  }

  return context;
}
