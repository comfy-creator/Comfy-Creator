import { useGraphContext } from '../../../contexts/graph';

const ClearButton = () => {
  const { addNewGraph } = useGraphContext();

  const handleClick = () => {
    const value = prompt('Name of the graph: ');
    if (value) {
      addNewGraph(value);
    }
  };

  return (
    <button id="comfy-clear-button" onClick={handleClick}>
      New Graph
    </button>
  );
};

export default ClearButton;
