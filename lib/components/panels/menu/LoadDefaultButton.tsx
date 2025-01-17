import { useGraph } from '../../../hooks/useGraph';
import { defaultEdges, defaultNodes } from '../../../default-graph';
import { uuidv4 } from 'lib0/random';
import { Button } from '../../ui/button';

const LoadDefaultButton = () => {
   const { loadSerializedGraph } = useGraph();

   const handleClick = () => {
      const value = confirm('Load default workflow?');

      if (value) {
         const graph = {
            id: uuidv4(),
            label: 'Default',
            nodes: defaultNodes,
            edges: defaultEdges
         };

         loadSerializedGraph(graph, true);
      }
   };

   return (
      <Button
         variant="outline"
         className="!py-1 h-[35px] hover:!bg-white/[1%] hover:!text-fg"
         id="comfy-load-default-button"
         onClick={handleClick}
      >
         Load Default
      </Button>
   );
};

export default LoadDefaultButton;