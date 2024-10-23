import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Layers, CopyIcon, PlayIcon } from "lucide-react";

interface ButtonsPanelProps {
  position?: PanelPosition;
}

export function ButtonsPanel({ position }: ButtonsPanelProps) {
  return (
    <Panel position={position}>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" className="gap-2">
          <Layers />
          <span>Nodes</span>
        </Button>

        <Button size="sm" variant="secondary" className="gap-2">
          <CopyIcon />
          <span>Duplicate</span>
        </Button>

        <Button size="sm" variant="secondary" className="gap-2">
          <PlayIcon />
          <span>Run</span>
        </Button>
      </div>
    </Panel>
  );
}
