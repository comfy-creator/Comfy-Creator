"use client";

import React, { useRef } from "react";
import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, EllipsisIcon, Trash2 } from "lucide-react";
import { InputHandles } from "./handles/inputs";
import { OutputHandles } from "./handles/outputs";
import { TextWidget } from "./widgets/text";
import { StringWidget } from "./widgets/string";

export const CozyNode = (node: NodeDefinition) => {
  return () => {
    const hRef = useRef<HTMLDivElement>(null);

    return (
      <Card className="min-w-[200px] max-w-[200px] relative rounded-sm">
        <CardHeader className="px-2 py-2 mb-2 flex items-center flex-row justify-between border-b">
          <div className="text-xs" style={{ fontSize: "10px" }}>
            {node.name}
          </div>

          <div className="flex flex-row gap-2">
            <ChevronDown className="w-3 h-3 cursor-pointer" />
            <EllipsisIcon className="w-3 h-3 cursor-pointer" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row" ref={hRef}>
            <InputHandles node={node} />
            <OutputHandles node={node} />
          </div>

          <div
            className="relative -mx-3 -my-1.5 flex flex-col gap-1"
            style={{ top: `-${hRef.current?.clientHeight}px` }}
          >
            {node.inputs.map((input, index) => {
              if (index == 3) return null;

              switch (input.type) {
                case "text":
                  return <TextWidget label={input.label} />;
                case "string":
                  return <StringWidget label={input.label} />;
                default:
                  return null;
              }
            })}
          </div>
        </CardContent>
      </Card>
    );
  };
};
