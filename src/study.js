import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';

export default function StudyPage() {
  return (<>
    <div>
      Hello world!
    </div>
  </>)
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<StudyPage />);