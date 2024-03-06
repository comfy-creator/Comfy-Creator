import { RFState, useFlowStore } from '../../../store/flow.ts';

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});
const ClearButton = () => {
  const {
    setNodes,
    setEdges,
  } = useFlowStore(selector);

  const handleClick = () => {
    const value = confirm("Clear workflow?");
    if (value) {
      setNodes([]);
      setEdges([]);
    }
  }

  return (
    <button
      id="comfy-clear-button"
      onClick={handleClick}
    >
      Clear
    </button>
  );
}

export default ClearButton;
