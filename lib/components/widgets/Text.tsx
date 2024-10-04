import { useState } from 'react';
import { RFState, useFlowStore } from '../../store/flow';
import { Textarea } from '@/components/ui/textarea';

type TextProps = {
   label: string;
   value?: string;
   disabled?: boolean;
   onChange?: (value: string) => void;
};

const selector = (state: RFState) => ({
   nodes: state.nodes,
   setNodes: state.setNodes,
   setPanOnDrag: state.setPanOnDrag
});

export function TextWidget({ disabled, value, onChange }: TextProps) {
   const { setPanOnDrag, setNodes, nodes } = useFlowStore(selector);
   const [inputValue, setInputValue] = useState(value);

   return (
      <Textarea
         rows={4}
         value={inputValue}
         disabled={disabled}
         className="w-full mt-2 !bg-bg !rounded-lg !text-dragText focus:!bg-bg hover:!bg-bg !text-[10px] !border-none resize-none focus:!ring-0"
         onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e.target.value);
         }}
         onMouseEnter={(e) => {
            e.stopPropagation();
            const newNodes = nodes.map((node) => {
               return {
                  ...node,
                  draggable: false
               };
            });
            setNodes(newNodes);
            setPanOnDrag(false);
         }}
         onMouseLeave={(e) => {
            e.stopPropagation();
            const newNodes = nodes.map((node) => {
               return {
                  ...node,
                  draggable: true
               };
            });
            setNodes(newNodes);
            setPanOnDrag(true);
         }}
      />
   );
}