// This is test code; uncomment later

// import { create } from 'zustand';
// import axios from 'axios';

// const useExtensionStore = create((set) => ({
//    apiEndpoints: new Map<string, unknown>(),
//    widgets: new Map<string, unknown>(),
//    nodeDefinitions: new Map<string, unknown>(),
//    setExtensions: (apiEndpoints, widgets, nodeDefinitions) =>
//       set({ apiEndpoints, widgets, nodeDefinitions })
// }));

// export const fetchExtensions = async () => {
//    try {
//       const response = await axios.get('https://your-server.com/api/extensions');
//       const { apiEndpoints, widgets, nodeDefinitions } = response.data;

//       useExtensionStore.getState().setExtensions(apiEndpoints, widgets, nodeDefinitions);
//    } catch (error) {
//       console.error('Failed to fetch extensions:', error);
//    }
// };

// // Widget components

// // ComponentRegistry.ts
// import NumberWidget from './widgets/NumberWidget';
// import StringWidget from './widgets/StringWidget';
// // Import other widgets...

// const componentRegistry = {
//    NumberWidget,
//    StringWidget
//    // other components...
// };

// export const getComponent = (name: string) => {
//    return componentRegistry[name] || null;
// };

// // Usage in a React component
// import React from 'react';
// import { getComponent } from './ComponentRegistry';

// const DynamicComponent = ({ componentName, ...props }) => {
//    const Component = getComponent(componentName);
//    return Component ? <Component {...props} /> : <div>Component not found</div>;
// };

// export default DynamicComponent;
