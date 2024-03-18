import { IGraphData, RFState, useFlowStore } from '../../../store/flow';
import { EditIcon } from '../../icons/Edit';
import { DeleteIcon } from '../../icons/Delete';

const selector = (state: RFState) => ({
  graphs: state.graphs,
  renameGraph: state.renameGraph,
  currentGraphIndex: state.currentGraphIndex,
  removeGraph: state.removeGraph,
  selectGraph: state.selectGraph,
});

const Graphs = () => {
  const {  graphs } = useFlowStore(selector);

  return (
    <div className="graphs_container">
      <h3 className="graph_title">Graphs</h3>
      {graphs.map(graph => (
        <Graph graph={graph} />
      ))}
    </div>
  )
};

const Graph = ({ graph }: { graph: IGraphData}) => {
  const { renameGraph, currentGraphIndex, removeGraph, selectGraph } = useFlowStore(selector);

  const handleEdit = () => {
    const value = prompt('Edit graph', graph.label);
    if (value) {
      renameGraph(graph.index, value);
    }
  }

  const handleDelete = () => {
    const value = confirm(`Delete graph ${graph.label}?`);
    if (value) {
      removeGraph(graph.index);
    }
  }

  const handleSelect = () => {
    selectGraph(graph.index);
  }

  return (
    <div className={`graph_container ${graph.index === currentGraphIndex ? "graph_selected" : ""}`} onClick={handleSelect}>
      <h3 className="graph_label">{graph.label}</h3>
      <div className="graph_actions">
        <EditIcon onClick={handleEdit} />
        <DeleteIcon fill="red" onClick={handleDelete} />
      </div>
    </div>
  );
}

export default Graphs;