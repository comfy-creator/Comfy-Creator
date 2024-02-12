interface ClearButtonProps {
  confirmClear: {
    value: boolean;
  };
}

const ClearButton = ({ confirmClear }: ClearButtonProps) => {
  return (
    <button
      id="comfy-clear-button"
      onClick={() => {
        if (!confirmClear.value || confirm("Clear workflow?")) {
          //   cleanApp();
          //   graph.clear();
        }
      }}
    >
      Clear
    </button>
  );
}

export default ClearButton;
