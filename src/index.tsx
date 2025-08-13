import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SimpleApp from './App-test';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
);
