import { useGraphContext } from '../../../contexts/graph';
import { IGraphRun } from '../../../store/database';
import CloseIcon from '../../icons/CloseIcon';
import LockIcon from '../../icons/LockIcon';

const GraphRuns = () => {
  const { stateRuns: runs } = useGraphContext();

  return (
    <div className="graphs_container">
      <h3 className="graph_title">Runs</h3>
      {runs.map((run, index) => (
        <GraphRun key={index} run={run} />
      ))}
    </div>
  );
};

const GraphRun = ({ run }: { run: IGraphRun }) => {
  const { currentStateGraphRunIndex, removeGraphRun, selectGraphRun } = useGraphContext();

  const handleDelete = () => {
    const value = confirm(`Delete run?`);
    if (value) {
      removeGraphRun(run.index);
    }
  };

  const handleSelect = () => {
    selectGraphRun(run.index);
  };

  return (
    <div
      className={`graph_container ${run.index === currentStateGraphRunIndex ? 'graph_selected' : ''}`}
    >
      <h3 onClick={handleSelect} className="graph_label">
        {run.label}
      </h3>
      <div className="graph_actions">
        <LockIcon fill="gray" />
        <CloseIcon fill="gray" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default GraphRuns;
