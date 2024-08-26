// import React, { useState, useEffect, ComponentType } from 'react';
// import { NodeProps } from '@xyflow/react';
// import { AppNode } from '../../types/types';

// interface DynamicNodeLoaderProps {
//    nodeType: string;
//    // Add other props as needed
// }

// const DynamicNodeLoader: React.FC<DynamicNodeLoaderProps> = ({ nodeType, ...props }) => {
//    const [DynamicComponent, setDynamicComponent] = useState<ComponentType<
//       NodeProps<AppNode>
//    > | null>(null);

//    useEffect(() => {
//       const fetchComponent = async () => {
//          try {
//             // Fetch the component code from the server
//             const response = await fetch(`/api/node-components/${nodeType}`);
//             const componentCode = await response.text();

//             // Create a new function to evaluate the code and return the component
//             const createComponent = new Function(
//                'React',
//                'NodeProps',
//                'AppNode',
//                `
//           ${componentCode}
//           return Component;
//         `
//             );

//             // Execute the function to get the component
//             const Component = createComponent(React, NodeProps, AppNode);
//             setDynamicComponent(() => Component);
//          } catch (error) {
//             console.error('Error loading dynamic component:', error);
//          }
//       };

//       fetchComponent();
//    }, [nodeType]);

//    if (!DynamicComponent) {
//       return <div>Loading...</div>;
//    }

//    return <DynamicComponent {...props} />;
// };

// export default DynamicNodeLoader;
