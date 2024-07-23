import {NodeResizeControl} from "@xyflow/react";

const GroupNode = () => {
  const resizerStyle = {
    width: "12px",
    height: "12px",
    border: "none",
    cursor: "se-resize",
  };

  return (
    <>
      <NodeResizeControl
        style={resizerStyle}
        color="transparent"
        position="bottom-right"
        minWidth={400}
        minHeight={400}
      />
      <div
        style={{
          fontSize: 12,
          color: "gray",
          width: "400px",
          height: "400px",
        }}
        className="node_container"
      >
        <div className="node_label_container">
          <span className="node_label" style={{ color: "gray" }}>
            Group
          </span>
        </div>
      </div>
    </>
  );
};

export default GroupNode;