import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

import './global.css';

import indexStyles from './Index.module.css';
import styles from './Study.module.css';

export default function StudyPage() {
  const [ currentDef, setCurrentDef ] = useState('me, myself, I, idek');

  return (<>
    <div><h1><span className={indexStyles.red}>字</span>Button</h1></div>

    <div className={styles.characterDisplayDiv}>
      <h1>Study Mode</h1>
      <p>Click the button that shows the next character stroke</p>

      <p class={styles.definition}>Definition: {currentDef}</p>
      <div class={`${styles.characterDisplay} surfaceDiv`}>
        beeg div
      </div>
    </div>

    <div>
      yo wsg whats up gamers
    </div>
  </>)
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<StudyPage />);