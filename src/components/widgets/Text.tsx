import { useEffect, useState } from 'react';
import { RFState, useFlowStore } from '../../store/flow.ts';

type TextProps = {
  label: string;
  disabled?: boolean;
  value: string;
  onChange?: (value: string) => void;
};

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  nodes: state.nodes,
  setPanOnDrag: state.setPanOnDrag,
});

export function TextWidget({ disabled, value, onChange }: TextProps) {

  const {
    setPanOnDrag,
    setNodes,
    nodes,
  } = useFlowStore(selector);

  const [inputValue, setInputValue] = useState(value);
  return (
    <textarea
      rows={4}
      value={inputValue}
      disabled={disabled}
      className={'comfy-multiline-input'}
      style={{ width: '100%', outline: 'none' }}
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
          }
        })
        setNodes(newNodes);
        setPanOnDrag(false);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        const newNodes = nodes.map((node) => {
          return {
            ...node,
            draggable: true
          }
        })
        setNodes(newNodes);
        setPanOnDrag(true);
      }}
    />
  );
}
