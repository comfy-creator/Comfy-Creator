import { useGraph } from '../../../hooks/useGraph';
import { defaultEdges, defaultNodes } from '../../../default-graph';
import { uuidv4 } from 'lib0/random';
import { RFState, useFlowStore } from '../../../store/flow';

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
    <button id="comfy-load-default-button" onClick={handleClick}>
      Load Default
    </button>
  );
};

export default LoadDefaultButton;
