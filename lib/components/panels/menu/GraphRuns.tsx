import { useGraphContext } from '../../../contexts/graph';
import { IGraphSnapshot } from '../../../store/database';
import CloseIcon from '../../icons/CloseIcon';
import LockIcon from '../../icons/LockIcon';

const GraphRuns = () => {
  const { snapshots: runs } = useGraphContext();

  return (
    <div className="graphs_container">
      <h3 className="my-[1px] mx-0 text-[0.9rem] text-[#b2b2b2]">Runs</h3>
      {runs.map((run, index) => (
        <GraphRun key={index} run={run} />
      ))}
    </div>
  );
};

const GraphRun = ({ run }: { run: IGraphSnapshot }) => {
  const { currentSnapshotIndex, removeGraphSnapshot, selectGraphSnapshot } = useGraphContext();

  const handleDelete = () => {
    const value = confirm(`Delete run?`);
    if (value) {
      removeGraphSnapshot(run.id);
    }
  };

  const handleSelect = () => {
    selectGraphSnapshot(run.id);
  };

  return (
     <div className={`padding-[3px] flex gap-[7px] flex-row items-center justify-between cursor-pointer ${run.id === currentSnapshotIndex ? 'bg-[#2e2e2e] rounded-[5px] border-[2px] border-[#b2b2b2]' : ''}`}>
        <h3 onClick={handleSelect} className="my-[1px] mx-0 text-[0.8rem] text-[#b2b2b2]">
           {run.label}
        </h3>
        <div className="flex gap-[10px] items-center justify-between text-[1.1rem]">
           <LockIcon fill="gray" />
           <CloseIcon fill="gray" onClick={handleDelete} />
        </div>
     </div>
  );
};

export default GraphRuns;