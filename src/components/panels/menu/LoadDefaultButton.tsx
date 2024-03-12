import { RFState, useFlowStore } from '../../../store/flow';
import { defaultEdges, defaultNodes } from '../../../default-flow';

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges
});

const LoadDefaultButton = () => {
  const { setNodes, setEdges } = useFlowStore(selector);

  const handleClick = () => {
    const value = confirm('Load default workflow?');
    if (value) {
      setNodes(defaultNodes);
      setEdges(defaultEdges);
    }
  };

  return (
    <button id="comfy-load-default-button" onClick={handleClick}>
      Load Default
    </button>
  );
};

export default LoadDefaultButton;
