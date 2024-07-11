import { RFState, useFlowStore } from '../../../store/flow';

const selector = (state: RFState) => ({
   setNodes: state.setNodes,
   setEdges: state.setEdges
});
const ClearButton = ({ confirmClear }: { confirmClear: { value: boolean } }) => {
   const { setNodes, setEdges } = useFlowStore(selector);

   const handleClick = () => {
      let clear = true;
      if (confirmClear.value) {
         clear = confirm('Clear workflow?');
      }

      if (clear) {
         setNodes([]);
         setEdges([]);
      }
   };

   return (
      <button id="comfy-clear-button" onClick={handleClick}>
         Clear
      </button>
   );
};

export default ClearButton;
