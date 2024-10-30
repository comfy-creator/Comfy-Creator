"use client";

import React, { useRef, useState, useEffect } from "react";
import { NodeDefinition } from "@/lib/types";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, EllipsisIcon, Trash2, ChevronUp } from "lucide-react";
import { InputHandles } from "./handles/inputs";
import { OutputHandles } from "./handles/outputs";
import { TextWidget } from "./widgets/text";
import { StringWidget } from "./widgets/string";

export const CozyNode = (node: NodeDefinition) => {
  return () => {
    const hRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);
    const [showAll, setShowAll] = useState(false);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
    const maxVisibleWidgets = 2; 

    useEffect(() => {
      const inputHeight = inputRef.current?.offsetHeight || 0;
      const outputHeight = outputRef.current?.offsetHeight || 0;
      
      setMaxHeight(Math.max(inputHeight, outputHeight));
    }, [showAll]);

    return (
      <Card className="min-w-[407px] relative rounded-sm">
        <CardHeader className="px-2 py-2 mb-2 flex items-center flex-row justify-between border-b">
          <div className="text-[]" style={{ fontSize: "1.125rem" }}>
            {node.name}
          </div>

          <div className="flex flex-row gap-2">
            {node.inputs.length > maxVisibleWidgets && (
              <div
                className={`cursor-pointer transition-transform duration-300 `}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </div>
            )}
            <EllipsisIcon className="w-3 h-3 cursor-pointer" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row absolute" ref={hRef}>
            <div ref={inputRef}>
              <InputHandles node={node} />
            </div>
            <div ref={outputRef}>
              <OutputHandles node={node} />
            </div>
          </div>

          <div
            className="relative -mx-3 -my-1.5 flex flex-col gap-1"
            style={{ minHeight: maxHeight }}
          >
            {node.inputs.slice(0, showAll ? undefined : maxVisibleWidgets).map((input, index) => {
              switch (input.type) {
                case "text":
                  return <TextWidget key={index} label={input.label} />;
                case "string":
                  return <StringWidget key={index} label={input.label} />;
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
