import { useState } from 'react';
import { RFState, useFlowStore } from '../../store/flow';
import { Textarea } from '@nextui-org/react';

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
         className="mt-2"
         classNames={{
            inputWrapper: '!bg-bg !rounded-lg !text-dragText focus:!bg-bg hover:!bg-bg',
            input: '!text-dragText  focus:!bg-bg !bg-bg hover:!bg-bg !text-[10px]'
         }}
         style={{ width: '100%', borderRadius: '4px' }}
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
