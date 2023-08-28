import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import HanziWriter from 'hanzi-writer';

import './global.css';

import indexStyles from './Index.module.css';
import styles from './Study.module.css';

import SurfaceButton from './components/baconerie/SurfaceButton/SurfaceButton';



function StrokeButton({ strokeId, currentCharacter }) {
  useEffect(() => {
    let buttonWriter = HanziWriter.create(document.getElementById(strokeId), currentCharacter, {
      width: 30,
      height: 30,
      padding: 0,
      showCharacter: false,
      showOutline: false,
      strokeColor: '#ffffff'
    })
    
    buttonWriter.animateStroke(strokeId);
  }, [])

  return (<>
    <SurfaceButton id={strokeId} className={styles.strokeButton}></SurfaceButton>
  </>)
}

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

  const [ currentCharacter, setCurrentCharacter ] = useState('');
  const [ currentDef, setCurrentDef ] = useState('');
  const [ currentPinyin, setCurrentPinyin ] = useState('');
  const [ charactersToQuiz, setCharactersToQuiz ] = useState([]);
  const [ correctStroke, setCorrectStroke ] = useState(0);
  const [ strokeIdList, setStrokeIdList ] = useState([]);
  const [ displayedStrokeIds, setDisplayedStrokeIds ] = useState([]);
  const [ finalStroke, setFinalStroke ] = useState(0);
  const [ characterInfo, setCharacterInfo ] = useState(null);
  const [ mainCharacterWriter, setMainCharacterWriter ] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('characterList') != null && localStorage.getItem('characterList') != '') {
      setCharactersToQuiz(localStorage.getItem('characterList').split(','));
    }

    loadCharacterInfo();
  }, []);

  useEffect(() => {
    if (characterInfo == null) return;

    quizNewCharacter();
  }, [characterInfo])

  async function loadCharacterInfo() {
    const response = await fetch('https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt');

    if (!response.ok) {
      alert('Unable to load character information! Please check your internet connection and try again. If this issue keeps happening, contact the developer. Code: ' + response.status);
      throw new Error('Unable to load character information! Please check your internet connection and try again. If this issue keeps happening, contact the developer. Code: ' + response.status);
    }

    let dictText = await response.text();
    dictText = dictText.split('\n');

    let newCharacterInfo = {};
    dictText.map(dictString => {
      if (dictString == '') return;

      const parsed = JSON.parse(dictString)
      if (localStorage.getItem('characterList').split(',').includes(parsed.character)) {
        newCharacterInfo[parsed.character] = parsed;
      }

    });

    setCharacterInfo(newCharacterInfo);
  }

  async function quizNewCharacter() {
    let newCharactersToQuiz = null;
    if (charactersToQuiz.length == 0) {
      newCharactersToQuiz = localStorage.getItem('characterList').split(',');
    } else {
      newCharactersToQuiz = [...charactersToQuiz];
    }

    let index = Math.floor(Math.random() * newCharactersToQuiz.length);
    const newCharacter = newCharactersToQuiz[index];
    newCharactersToQuiz.splice(index, 1);

    let newStrokeIdList = [];
    let numOfStrokes = await HanziWriter.loadCharacterData(newCharacter);

    numOfStrokes = numOfStrokes['strokes'].length;

    for (let strokeNum = 0; strokeNum < numOfStrokes; strokeNum++) {
      newStrokeIdList.push(strokeNum);
    }

    newStrokeIdList.splice(newStrokeIdList.indexOf(0), 1);
    let newDisplayedStrokeIds = [0];
    if (newStrokeIdList <= 3) {
      newDisplayedStrokeIds = newDisplayedStrokeIds.concat(strokeIdList);
      strokeIdList = [];
    } else {
      for(let i=0;i<3;i++) {
        if (newStrokeIdList.length == 0) break;

        let index = Math.floor(Math.random() * newStrokeIdList.length);
        newDisplayedStrokeIds.push(newStrokeIdList[index]);
        newStrokeIdList.splice(index, 1);
      }
    }

    setCorrectStroke(0);
    setCharactersToQuiz(newCharactersToQuiz);
    setCurrentCharacter(newCharacter);
    setCurrentDef(characterInfo[newCharacter].definition);
    setCurrentPinyin(characterInfo[newCharacter].pinyin.join(', '));
    setStrokeIdList(newStrokeIdList);
    setDisplayedStrokeIds(newDisplayedStrokeIds);
    setFinalStroke(numOfStrokes-1);

    const characterDisplay = document.getElementById(styles.characterDisplay);
    let sizeToUse = characterDisplay.clientHeight < characterDisplay.clientWidth ? characterDisplay.clientHeight : characterDisplay.clientWidth;
    let newMainCharacterWriter = HanziWriter.create(document.getElementById(styles.characterDisplay), newCharacter, {
      width: sizeToUse-25,
      height: sizeToUse-25,
      padding: 16,
      showCharacter: false,
      showOutline: false,
      strokeColor: '#ffffff'
    })

    setMainCharacterWriter(newMainCharacterWriter)
  }

  return (<>
    <div><h1><span className={indexStyles.red}>字</span>Button</h1></div>

    <div className={styles.characterDisplayDiv}>
      <h1>Study Mode</h1>
      <p>Click the button that shows the next character stroke.</p>

      <p class={styles.definition}><b>Definition</b>: {currentDef}, <b>Pinyin</b>: {currentPinyin}</p>

      <div id={styles.characterDisplay} className={'surfaceDiv'}>
      </div>
    </div>

    <div className={styles.buttonBar}>
      {displayedStrokeIds.map(id => <StrokeButton strokeId={id} currentCharacter={currentCharacter}/>)}
    </div>
  </>)
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<StudyPage />);