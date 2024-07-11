import { NodeDefinition, UpdateInputData } from '../../types/types';

type ModelLoaderProps = {
   label: string;
   value: string;
   disabled?: boolean;
   options: { values: string[] | (() => string[]) };
   onChange?: (value: string) => void;
   multiSelect?: boolean;
};

export const ModelLoader = ({
   nodeDef,
   updateInputData
}: {
   nodeDef: NodeDefinition;
   updateInputData: UpdateInputData;
}) => {
   return
};

export default ModelLoader;
