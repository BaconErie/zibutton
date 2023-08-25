import React from 'react';
import { createRoot } from 'react-dom/client';

import './global.css';
import styles from './Index.module.css';

import PrimaryButton from './components/baconerie/PrimaryButton/PrimaryButton';

export default function MainComponent() {
  function handleAddCharacter() {
    
  }

  return (<>
    <div><h1>字Button</h1></div>

    <div>
      <h1>Create a list</h1>
      <div class="wrapper">
        <input id="" type="text" placeholder="Enter a character" />
        <PrimaryButton onClick={}>Add a character</PrimaryButton>
      </div>

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