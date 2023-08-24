import React from 'react';
import { createRoot } from 'react-dom/client';

export default function MainComponent() {
  return (<>
    
  </>) 
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<MainComponent />); 