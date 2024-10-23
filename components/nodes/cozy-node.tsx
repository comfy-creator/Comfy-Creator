"use client";

import React from "react";
import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CozyNode = (node: NodeDefinition) => {
  return () => (
    <Card className="min-w-[200px] relative rounded-sm">
      <CardHeader className="px-2 py-2 mb-2 border-b">
        <div className="text-xs" style={{ fontSize: "10px" }}>
          {node.name}
        </div>
      </CardHeader>

      <CardContent>
        {/* Node title
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-200">{node.name}</h3>
                    <span className="text-xs text-gray-400">{node.type}</span>
                </div> */}

        {/* Input handles on the left */}
        <div className="flex justify-between">
          <div className="relative">
            {node.inputs.map((input, index) => (
              <div
                key={input.name}
                className="flex items-center"
                style={{ position: "relative", top: `${index}px` }}
              >
                <span
                  className="text-xs"
                  style={{
                    fontSize: "8px",
                    left: `-90px`,
                    position: "relative",
                    float: "left",
                  }}
                >
                  {input.name}
                </span>
                <Handle
                  type="target"
                  id={input.name}
                  position={Position.Left}
                  style={{ left: "-24.5px" }}
                  className="w-0.5 h-0.5 border rounded-full"
                />
              </div>
            ))}
          </div>

          {/* Output handles on the right */}
          <div className="relative">
            {node.outputs.map((output, index) => (
              <div
                key={output.name}
                className="flex items-center justify-end"
                style={{ position: "relative", top: `${index}px` }}
              >
                <Handle
                  type="source"
                  position={Position.Right}
                  id={output.name}
                  className="w-0.5 h-0.5 border rounded-full"
                  style={{ right: "-24.5px" }}
                />
                <span
                  className="text-xs"
                  style={{
                    fontSize: "8px",
                    right: "-65px",
                    position: "relative",
                  }}
                >
                  {output.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
