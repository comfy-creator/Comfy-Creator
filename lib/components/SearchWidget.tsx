import React, { useEffect, useState } from 'react';
import NodeInfo from '../../node_info.json';
import { useFlowStore } from '../store/flow.ts';

const data = {
  slotInTypeFilter: [
    { label: 'clip', value: 'clip' },
    { label: 'conditioning', value: 'conditioning' },
    { label: 'image', value: 'image' },
    { label: 'latent', value: 'latent' },
    { label: 'model', value: 'model' },
    { label: 'vae', value: 'vae' }
  ],
  slotOutTypeFilter: [
    { label: 'LATENT', value: 'LATENT' },
    { label: 'MODEL', value: 'MODEL' },
    { label: 'CLIP', value: 'CLIP' },
    { label: 'VAE', value: 'VAE' },
    { label: 'CONDITIONING', value: 'CONDITIONING' },
    { label: 'IMAGE', value: 'IMAGE' },
    { label: 'MASK', value: 'MASK' },
    { label: 'CLIP_VISION_OUTPUT', value: 'CLIP_VISION_OUTPUT' },
    { label: 'CONTROL_NET', value: 'CONTROL_NET' },
    { label: 'STYLE_MODEL', value: 'STYLE_MODEL' },
    { label: 'CLIP_VISION', value: 'CLIP_VISION' },
    { label: 'GLIGEN', value: 'GLIGEN' },
    { label: 'UPSCALE_MODEL', value: 'UPSCALE_MODEL' },
    { label: 'SIGMAS', value: 'SIGMAS' },
    { label: 'SAMPLER', value: 'SAMPLER' }
  ]
};

interface IDataType {
  label: string;
  value: string;
  isGeneric?: boolean;
}

interface IProp {
  handleMouseLeave: () => void;
  handleMouseIn: () => void;
  show: boolean;
  widgetRef: any;
  props: any;
}

const SearchWidget = ({ handleMouseLeave, handleMouseIn, show, widgetRef, props }: IProp) => {
  const [allData, setAllData] = useState<IDataType[]>([]);
  const [displayData, setDisplayData] = useState<IDataType[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({ inType: '', outType: '' });
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const nodes = Object.entries(NodeInfo).map(([key]) => ({
      label: key,
      value: key,
      isGeneric: false
    }));
    setAllData(nodes);
    setDisplayData(nodes);
  }, []);

  useEffect(() => {
    const { inType, outType } = filterCriteria;
    let newData = allData;

    if (inType || outType) {
      const filteredData = Object.entries(NodeInfo)
        .filter(
          ([_, value]) => !inType || Object.keys(value?.input?.required || {}).includes(inType)
        )
        .filter(([_, value]) => !outType || ((value?.output as string[]) || []).includes(outType))
        .map(([key]) => ({
          label: key,
          value: key,
          isGeneric: false
        }));

      const nodesWithGenericFlag = allData.map((item) => ({
        ...item,
        isGeneric: true
      }));

      newData = [...filteredData, ...nodesWithGenericFlag];
    }

    if (searchValue) {
      newData = newData.filter((item) => item.value.toLowerCase().includes(searchValue));
    }

    setDisplayData([...newData]);
  }, [filterCriteria, searchValue, allData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value.toLowerCase();
    setSearchValue(text);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: 'inType' | 'outType'
  ) => {
    setFilterCriteria((prev) => ({ ...prev, [type]: e.target.value }));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, value: string) => {
    const position = { x: e.clientX, y: e.clientY };

    const { addNode } = useFlowStore.getState();
    addNode({
      position,
      type: value,
      defaultValues: {}
    });
  };

  const style = {
    ...(props.top !== undefined ? { top: `${props.top}px` } : {}),
    ...(props.left !== undefined ? { left: `${props.left}px` } : {}),
    ...(props.right !== undefined ? { right: `${props.right}px` } : {}),
    ...(props.bottom !== undefined ? { bottom: `${props.bottom}px` } : {})
  };

  return (
    <div
      ref={widgetRef}
      className="react-flow litesearchbox graphdialog rounded"
      style={{ ...style, display: show ? 'block' : 'none' }}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseIn}
    >
      <span className="name">Search</span>
      <input autoFocus={true} type="text" className="value rounded" onChange={handleSearch} />
      <select className="slot_in_type_filter" onChange={(e) => handleFilterChange(e, 'inType')}>
        <option value=""></option>
        {data.slotInTypeFilter.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select className="slot_out_type_filter" onChange={(e) => handleFilterChange(e, 'outType')}>
        <option value=""></option>
        {data.slotOutTypeFilter.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <div className="helper">
        {displayData.map((item, index) => (
          <div
            key={index}
            data-type={item.value}
            className={`react-flow lite-search-item ${item.isGeneric ? 'generic_type' : ''}`}
            onClick={(e) => handleClick(e, item.value)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchWidget;
