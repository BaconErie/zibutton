import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

import './global.css';

import indexStyles from './Index.module.css';
import styles from './Study.module.css';

export default function StudyPage() {
  /*
    ON PAGE LOAD
    ============
    1. On page load, set charactersToQuiz to the all the characters
    2. Set correctStroke to 0
    2. Randomly pick a character, set that as the current character. Remove the character from charactersToQuiz
    3. Get the defintion and set it as the definition
    4. Create a list of stroke ids, with id corresponding to order in which the stroke should appear
    5. Clear displayedStrokeIds
    6. Render the stroke with the same id as correctStroke. Remove it from list of stroke ids
    7. Randomly pick 3 other ids, render those strokes, remove those ids from list of stroke ids. If not enough ids just render all of them
    8. Render the defintion and the character box thing
    9. Set the finalStroke to the final stroke id

    ON STROKE BUTTON CLICK
    ======================
    1. If stroke id == correct stroke:
      1. If stroke id == finalStroke:
        1. Hide all stroke buttons with character complete overlay for 1 second
        2. Display new character (step 2-9)
      2. Else:
        1. Hide all stroke buttons with correct overlay for 0.5 second
        2. Increase correctStroke by 1
        2. Repeat 5-9
    2: Else:
      1. Hide the button with the incorrect thing for 0.5 second
      2. Choose a different stroke id
      3. Replace the clicked button with a new button using the different stroke id

  */

  const [ currentDef, setCurrentDef ] = useState('');
  const [ charactersToQuiz, setCharactersToQuiz ] = useState([]);
  const [ correctStroke, setCorrectStroke ] = useState(0);
  const [ strokeIdList, setStrokeIdList ] = useState([]);
  const [ displayedStrokeIds, setDisplayedStrokeIds ] = useState([]);
  const [ finalStroke, setFinalStroke ] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('characterList') != null && localStorage.getItem('characterList') != '') {
      setCharactersToQuiz(localStorage.getItem('characterList').split(','));
    }
  }, []);

  return (<>
    <div><h1><span className={indexStyles.red}>字</span>Button</h1></div>

    <div className={styles.characterDisplayDiv}>
      <h1>Study Mode</h1>
      <p>Click the button that shows the next character stroke.</p>

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