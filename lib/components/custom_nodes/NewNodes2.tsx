// import React, { useState, useEffect, useMemo } from 'react';
// import { useEdgesState, useEdges } from 'reactflow';

// type HandleDefinition = {
//    display_name: string;
//    edge_type: string;
// };

// type NodeInterface = {
//    inputs: Record<string, HandleDefinition>;
//    outputs: Record<string, HandleDefinition>;
// };

// interface MyNodeProps {
//    nodeId: string;
//    nodeInterface: NodeInterface;
//    setNodeInterface: React.Dispatch<React.SetStateAction<NodeInterface>>;
// }

// // type InputValue =
// //    | { type: 'value'; value: any } // Static values known ahead of time
// //    | { type: 'ref'; ref: { nodeId: string; outputId: string } }; // Values that will be computed at runtime
// type InputValue = {
//    value?: any;
//    ref?: { nodeId: string; outputId: string };
// };

// type InputValues = Map<string, InputValue>;

// const useInputEdges = (nodeId: string) => {
//    //    const edges = useEdgesState([]);
//    const edges = useEdges<string>();

//    return useMemo(() => {
//       return edges.filter((edge) => edge.target === nodeId);
//    }, [edges, nodeId]);
// };

// const MyNode: React.FC<MyNodeProps> = ({ nodeId, nodeInterface, setNodeInterface }) => {
//    //    const incomingEdges = useInputEdges(nodeId);
//    //    const widgetStates = useWidgetStates();

//    const inputValues: InputValues = useInputValues(); // pretend this exists; this is relevant
//    const modelRegistry: Map<string, ModelInfo> = useModelRegistry(); // pretend this exists

//    useEffect(() => {
//       const input = inputValues.get('modelName'); // assume this works and it's a string

//       if (input?.value) {
//          const selectedModel = input.value;
//          const modelInfo = modelRegistry.get(selectedModel); // assume this is possible
//          // we could add a 'derived_value' maybe? Or a TBD value

//          setNodeInterface((nodeInterface) => {
//             const { inputs, outputs: _ } = nodeInterface;
//             const outputs: Record<string, any> = {};
//             for (const [key, architecture] of Object.entries(modelInfo.architectures)) {
//                outputs[key] = architecture;
//             }

//             return {
//                inputs,
//                outputs
//             };
//          });
//       }
//    }, [inputValues, modelRegistry, setNodeInterface]);

//    return NodeTemplate({ nodeInterface }); // this consumes inputValues on its own presumably
// };

// export default MyNode;
