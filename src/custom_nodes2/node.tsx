import React from 'react';
import { Handle, Position } from 'reactflow';
import { NodeData } from './types';

export const NodeTemplate = ({ data }: { data: NodeData }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', background: '#f9f9f9', position: 'relative' }}>
      <div style={{ marginBottom: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: '-20px' }}>
        {data.label}
      </div>
      {/* Render input handles */}
      {Object.entries(data.inputs.required).map(([key, value], index) => (
        <div style={{ position: 'absolute', left: 0, top: `${25 * (index + 1)}%`, display: 'flex', alignItems: 'center' }}>
          <Handle
            key={key}
            type="target"
            position={Position.Left}
            id={key}
            style={{ background: 'purple' }} // Changed to purple
          />
          <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>{key}</span> {/* Text size reduced */}
        </div>
      ))}
      {data.inputs.optional && Object.entries(data.inputs.optional).map(([key, value], index) => (
        <div style={{ position: 'absolute', left: 0, top: `${25 * (index + 1 + Object.keys(data.inputs.required).length)}%`, display: 'flex', alignItems: 'center' }}>
          <Handle
            key={key}
            type="target"
            position={Position.Left}
            id={key}
            style={{ background: 'purple' }} // Changed to purple for optional inputs as well
          />
          <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>{key}</span> {/* Text size reduced */}
        </div>
      ))}
      {/* Render output handles */}
      {data.outputs.map((output, index) => (
        <div style={{ position: 'absolute', right: 0, top: `${100 / (data.outputs.length + 1) * (index + 1)}%`, display: 'flex', alignItems: 'center' }}>
          <Handle
            key={output}
            type="source"
            position={Position.Right}
            id={output}
            style={{ background: 'yellow' }}
          />
          <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>{output}</span> {/* Text size reduced */}
        </div>
      ))}
      <div>
        {/* Content goes here */}
      </div>
    </div>
  );
};
