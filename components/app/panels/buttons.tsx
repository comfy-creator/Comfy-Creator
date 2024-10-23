"use client";

import { Button } from "@/components/ui/button";
import { Layers, CopyIcon, PlayIcon } from "lucide-react";
import { Panel, PanelPosition } from "@xyflow/react";
import { useOverlay } from "@/components/providers/overlay";

interface ButtonsPanelProps {
  position?: PanelPosition;
}

export function ButtonsPanel({ position }: ButtonsPanelProps) {
  const { open } = useOverlay();

  return (
    <Panel position={position}>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gap-2"
          variant="secondary"
          onClick={() => open("nodes-sheet")}
        >
          <Layers />
          <span>Nodes</span>
        </Button>

        <Button size="sm" variant="secondary" className="gap-2">
          <PlayIcon />
          <span>Run</span>
        </Button>
      </div>
    </Panel>
  );
}
