import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import styles from './Index.module.css';

export default function MainComponent() {
  return (<>
    <div><h1>字Button</h1></div>

    <div>
      <h1>Create a list</h1>

      <ul className={styles.characterList}>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
        <li>lmao</li>
      </ul>
    </div>
  </>) 
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<MainComponent />); 