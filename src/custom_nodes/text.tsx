import { useCallback, ChangeEvent } from 'react';
import { Handle, Position } from 'reactflow';
 
// const handleStyle = { left: 10 };
 
export function TextNode({ data }: { data: { text: string }}) {
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target?.value);
  }, []);
 
  return (
    <div className="text-node">
      <Handle
        type="target"
        position={Position.Left}
        id="CLIP"
        style={{ background: 'purple' }}
      />
      <Handle type="source" position={Position.Right} id={"conditioning"} style={{ background: 'yellow' }} />
      <div>
        <label htmlFor="text">Text:</label><br />
        <input id="text" name="text" onChange={onChange} className="nodrag" defaultValue={data.text} />
      </div>

    </div>
  );
}