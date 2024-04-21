import { useGraph } from '../../../lib/hooks/useGraph';
import { defaultEdges, defaultNodes } from '../../../default-graph';

const LoadDefaultButton = () => {
  const { loadSerializedGraph } = useGraph();

  const handleClick = () => {
    const value = confirm('Load default workflow?');

    if (value) {
      const graph = {
        nodes: defaultNodes,
        edges: defaultEdges,
        viewport: { x: 1, y: 1, zoom: 1 }
      };

      loadSerializedGraph(graph);
    }
  };

  return (
    <button id="comfy-load-default-button" onClick={handleClick}>
      Load Default
    </button>
  );
};

export default LoadDefaultButton;
