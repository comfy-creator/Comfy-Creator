import { usePrompt } from "../../../hooks/usePrompt.tsx";

interface DevSaveButtonProps {
  promptFilename: {
    value: boolean;
  };
}

const DevSaveButton = ({ promptFilename }: DevSaveButtonProps) => {
  const { graphToPrompt } = usePrompt();

  const handleClick = () => {
    let filename: string | null = "workflow_api.json";
    if (promptFilename.value) {
      filename = prompt("Save workflow (API) as:", filename);
      if (!filename) return;
      if (!filename.toLowerCase().endsWith(".json")) {
        filename += ".json";
      }
    }

    graphToPrompt().then((p: any) => {
      const json = JSON.stringify(p.workflow, null, 2); // convert the data to a JSON string
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const tag = document.createElement("a");
      tag.href = url;
      tag.download = filename;
      document.body.appendChild(tag);
      tag.click();

      document.body.removeChild(tag);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <button
      id="comfy-dev-save-api-button"
      style={{ width: "100%", display: "none" }}
      onClick={handleClick}
    >
      Save (API Format)
    </button>
  );
};

export default DevSaveButton;
