import { EditIcon } from '../../icons/Edit';
import { IGraphData } from '../../../store/database';
import { useGraphContext } from '../../../contexts/graph';
import AddIcon from '../../icons/AddIcon';
import CloseIcon from '../../icons/CloseIcon';

const Graphs = () => {
  const { graphs, addNewGraph } = useGraphContext();

  const handleAdd = () => {
    const value = prompt('Name of the graph: ');
    if (value) {
      addNewGraph(value);
    }
  };

  return (
    <div className="graphs_container">
      <div className="graph_title_container">
  

        <h3 className="text-[0.9rem] text-borderColor my-[1px] mx-0">Workspace</h3>
        <span className="text-[1.2rem] text-borderColor cursor-pointer" onClick={handleAdd}>
          <AddIcon />
        </span>
      </div>
      {graphs.slice().reverse().map((graph, index) => (
        <Graph key={index} graph={graph} />
      ))}
    </div>
  );
};

const Graph = ({ graph }: { graph: IGraphData }) => {
  const {
    renameGraph,
    removeGraph,
    setCurrentGraphIndex,
    currentGraphIndex
  } = useGraphContext();

  const handleEdit = () => {
    const value = prompt('Edit graph', graph.label);
    if (value) {
      renameGraph(graph.id, value);
    }
  };

  const handleDelete = () => {
    const value = confirm(`Delete graph ${graph.label}?`);
    if (value) {
      removeGraph(graph.id);
    }
  };

  const handleSelect = () => {
    setCurrentGraphIndex(graph.id);
  };

  return (
    <div className={`flex flex-row items-center justify-between gap-7 cursor-pointer p-[3px] bg-comfyMenuBg ${graph.id === currentGraphIndex ? 'graph_selected' : ''}`}>
  


      <h3 className="text-[0.8rem] text-borderColor my-[1px] mx-0" onClick={handleSelect}>
        {graph.label}
      </h3>
      <div className="flex gap-[10px] items-center justify-between text-[1.1rem] ">
        <EditIcon onClick={handleEdit} className='text-borderColor' />
        <CloseIcon fill="gray" onClick={handleDelete} className='text-borderColor' />
      </div>
    </div>
  );
};

export default Graphs;