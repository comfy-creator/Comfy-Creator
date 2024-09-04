import React from 'react';
import ReactDOM from 'react-dom/client';

import GraphEditor from '../lib';
import { NextUIProvider } from '@nextui-org/react';
import '../lib/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      {/* <NextUIProvider> */}
      <GraphEditor />
      {/* </NextUIProvider> */}
   </React.StrictMode>
);
