import { RFState, useFlowStore } from '../../../store/flow.ts';

const selector = (state: RFState) => ({
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  addNewGraph: state.addGraph
});
const ClearButton = () => {
  const {
    addNewGraph
  } = useFlowStore(selector);

  const handleClick = () => {
    const value = prompt("Name of the graph: ");
    addNewGraph(value)
  }

  return (
    <button
      id="comfy-clear-button"
      onClick={handleClick}
    >
      New
    </button>
  );
};

export default ClearButton;
