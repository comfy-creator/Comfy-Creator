import { EditIcon } from '../../icons/Edit';
import { IGraphData } from '../../../store/database';
import { useGraphContext } from '../../../contexts/graph';
import AddIcon from '../../icons/AddIcon';
import CloseIcon from '../../icons/CloseIcon';

const Graphs = () => {
  const { stateGraphs, addNewGraph } = useGraphContext();

  const handleAdd = () => {
    const value = prompt('Name of the graph: ');
    if (value) {
      addNewGraph(value);
    }
  };

  return (
    <div className="graphs_container">
      <div className="graph_title_container">
        <h3 className="graph_title">Workspace</h3>
        <span className="add_graph_icon" onClick={handleAdd}>
          <AddIcon />
        </span>
      </div>
      {stateGraphs.slice().reverse().map((graph, index) => (
        <Graph key={index} graph={graph} />
      ))}
    </div>
  );
};

const Graph = ({ graph }: { graph: IGraphData }) => {
  const {
    renameGraph,
    removeGraph,
    selectGraph,
    currentStateGraphIndex: currentGraphIndex
  } = useGraphContext();

  const handleEdit = () => {
    const value = prompt('Edit graph', graph.label);
    if (value) {
      renameGraph(graph.index, value);
    }
  };

  const handleDelete = () => {
    const value = confirm(`Delete graph ${graph.label}?`);
    if (value) {
      removeGraph(graph.index);
    }
  };

  const handleSelect = () => {
    selectGraph(graph.index);
  };

  return (
    <div className={`graph_container ${graph.index === currentGraphIndex ? 'graph_selected' : ''}`}>
      <h3 className="graph_label" onClick={handleSelect}>
        {graph.label}
      </h3>
      <div className="graph_actions">
        <EditIcon onClick={handleEdit} />
        <CloseIcon fill="gray" onClick={handleDelete} />
      </div>
    </div>
  );
};

export default Graphs;
