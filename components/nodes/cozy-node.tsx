"use client";

import React from "react";
import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export const CozyNode = (node: NodeDefinition) => {
  return () => (
    <Card className="min-w-[200px] relative rounded-sm">
      <CardHeader className="px-2 py-2 mb-2 border-b flex items-center flex-row justify-between">
        <div className="text-xs" style={{ fontSize: "10px" }}>
          {node.name}
        </div>
        
        <div className="">
          <Trash2 className="cursor-pointer hover:text-red-500 active:text-red-700" size={10} />
        </div>

      </CardHeader>

      <CardContent>
        {/* Node title
                <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-200">{node.name}</h3>
                    <span className="text-xs text-gray-400">{node.type}</span>
                </div> */}

        {/* Input handles on the left */}
        <div className="flex ">
          <div className="relative">
            {node.inputs.map((input, index) => (
              <div
                key={input.name}
                className="flex items-center"
                style={{ position: "relative", top: `${index}px` }}
              >
                <div className="text-content-base px-1.5 py-0.5 text-[8px] absolute flex w-fit items-center font-mono font-normal right-[30px] mb-[5px] ">
                  <span className=" whitespace-nowrap text-[7px]">
                    {input.name}
                  </span>
                </div>
                <Handle
                  type="target"
                  id={input.name}
                  position={Position.Left}
                  style={{ left: "-24.5px", position: "relative", margin: "5px 0" }}
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
                <div className="text-content-base px-1.5 py-0.5 text-xs absolute bottom-[0.5px]  mr-6 flex w-fit items-center bg-surface-300/60 font-mono font-normal left-[143px]  ml-6">
                  <span className="pointer-events-none cursor-default whitespace-nowrap text-[8px]">
                    {output.name}
                  </span>
                </div>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={output.name}
                  className="w-0.5 h-0.5 border rounded-full"
                  style={{ right: "-162px", position: "relative", margin: "5px 0"  }}
                />
              </div>

            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


