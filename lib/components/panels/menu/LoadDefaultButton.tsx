import { useGraph } from '../../../hooks/useGraph';
import { defaultEdges, defaultNodes } from '../../../default-graph';
import { uuidv4 } from 'lib0/random';
import { RFState, useFlowStore } from '../../../store/flow';
import { Button } from '@nextui-org/react';

const LoadDefaultButton = () => {
   const { loadSerializedGraph } = useGraph();

   const handleClick = () => {
      const value = confirm('Load default workflow?');

      if (value) {
         const graph = {
            index: uuidv4(),
            label: 'Default',
            nodes: defaultNodes,
            edges: defaultEdges
         };

         loadSerializedGraph([graph], true);
      }
   };

   return (
      <Button
         variant="bordered"
         className="!py-1 h-[35px]"
         id="comfy-load-default-button"
         onClick={handleClick}
      >
         Load Default
      </Button>
   );
};

export default LoadDefaultButton;
