import React from 'react';
import { Handle, HandleProps, Position } from 'reactflow';
import { DataType } from '../types';

interface TypedHandleProps extends HandleProps {
  dataType: DataType;
}

const TypedHandle: React.FC<TypedHandleProps> = ({ dataType, ...handleProps }) => {
  return <Handle {...handleProps} dataType={dataType} />;
};

export default TypedHandle;
