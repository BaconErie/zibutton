import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import HanziWriter from 'hanzi-writer';

import './global.css';

import indexStyles from './Index.module.css';
import styles from './Study.module.css';

import SurfaceButton from './components/baconerie/SurfaceButton/SurfaceButton';



function StrokeButton({ strokeId, currentCharacter, setSelectedStrokeId }) {
  useEffect(() => {
    let buttonWriter = HanziWriter.create(document.getElementById(strokeId), currentCharacter, {
      width: 50,
      height: 50,
      padding: 0,
      showCharacter: false,
      showOutline: false,
      strokeColor: '#ffffff'
    })
    
    buttonWriter.animateStroke(strokeId);
  }, [])

  function handleButtonClick() {
    setSelectedStrokeId(strokeId);    
  }

  return (<>
    <SurfaceButton id={strokeId} className={styles.strokeButton} onClick={handleButtonClick}></SurfaceButton>
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
  const [ selectedStrokeId, setSelectedStrokeId ] = useState(null);

  /* UI STATES */
  const [ isCharacterCompleteShown, setIsCharacterCompleteShown ] = useState(false);
  const [ isCorrectStrokeShown, setIsCorrectStrokeShown ] = useState(false);
  const [ isIncorrectShown, setIsIncorrectShown ] = useState(false);
  const [ isDoneShown, setIsDoneShown ] = useState(false);

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

  useEffect(() => {
    if (selectedStrokeId == null) return; // why cant react just not run this the first time
    
    /*
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

    if (selectedStrokeId == correctStroke) {
      mainCharacterWriter.animateStroke(correctStroke);

      if (selectedStrokeId == finalStroke) {
        if (charactersToQuiz.length == 0) {
          setIsDoneShown(true);
          return;
        }

        setIsCharacterCompleteShown(true);
        setDisplayedStrokeIds([]);
        setTimeout(quizNewCharacter, 1000);
      } else {
        setCorrectStroke(correctStroke => correctStroke + 1);
        setIsCorrectStrokeShown(true);
        setTimeout(() => {refreshStrokes(correctStroke+1); setIsCorrectStrokeShown(false);}, 500);
      }
    } else {
      setIsIncorrectShown(true);
      setTimeout(() => {refreshStrokes(correctStroke+1); setIsIncorrectShown(false);}, 500);
    }
  }, [selectedStrokeId])

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
    let newCharactersToQuiz = [...charactersToQuiz];
    
    if (newCharactersToQuiz.length == 0) {
      return;
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
    if (newStrokeIdList.length <= 3) {
      newDisplayedStrokeIds = newDisplayedStrokeIds.concat(newStrokeIdList);
      newStrokeIdList = [];
    } else {
      for(let i=0;i<3;i++) {
        if (newStrokeIdList.length == 0) break;

        let index = Math.floor(Math.random() * newStrokeIdList.length);
        newDisplayedStrokeIds.push(newStrokeIdList[index]);
        newStrokeIdList.splice(index, 1);
      }
    }

    shuffle(newDisplayedStrokeIds);

    setCorrectStroke(0);
    setCharactersToQuiz(newCharactersToQuiz);
    setCurrentCharacter(newCharacter);
    setCurrentDef(characterInfo[newCharacter].definition);
    setCurrentPinyin(characterInfo[newCharacter].pinyin.join(', '));
    setStrokeIdList(newStrokeIdList);
    setDisplayedStrokeIds(newDisplayedStrokeIds);
    setFinalStroke(numOfStrokes-1);
    setIsCharacterCompleteShown(false);
    setSelectedStrokeId(null);

    const characterDisplay = document.getElementsByClassName(styles.mainCharacterDisplay)[0];
    characterDisplay.innerHTML = '';
    let sizeToUse = characterDisplay.clientHeight < characterDisplay.clientWidth ? characterDisplay.clientHeight : characterDisplay.clientWidth;
    let newMainCharacterWriter = HanziWriter.create(document.getElementsByClassName(styles.mainCharacterDisplay)[0], newCharacter, {
      width: sizeToUse-25,
      height: sizeToUse-25,
      padding: 0,
      showCharacter: false,
      showOutline: false,
      strokeColor: '#ffffff'
    })

    document.getElementsByClassName(styles.mainCharacterDisplay)[0].style.backgroundSize = sizeToUse-25 + 'px';

    setMainCharacterWriter(newMainCharacterWriter);
  }

  function refreshStrokes(newCorrectStroke) {
    /*
    5. Clear displayedStrokeIds
    6. Render the stroke with the same id as correctStroke. Remove it from list of stroke ids
    7. Randomly pick 3 other ids, render those strokes, remove those ids from list of stroke ids. If not enough ids just render all of them
    */
   
    let newDisplayedStrokeIds = [newCorrectStroke];
    let newStrokeIdList = [...strokeIdList];

    newStrokeIdList = newStrokeIdList.concat(displayedStrokeIds);

    newStrokeIdList.splice(newStrokeIdList.indexOf(newCorrectStroke), 1);

    if (newStrokeIdList.length <= 3) {
      newDisplayedStrokeIds = newDisplayedStrokeIds.concat(newStrokeIdList);
      newStrokeIdList = [];
    } else {
      for(let i=0;i<3;i++) {
        if (newStrokeIdList.length == 0) break;

        let index = Math.floor(Math.random() * newStrokeIdList.length);
        newDisplayedStrokeIds.push(newStrokeIdList[index]);
        newStrokeIdList.splice(index, 1);
      }
    }

    shuffle(newDisplayedStrokeIds);
    
    setDisplayedStrokeIds(newDisplayedStrokeIds);
    setStrokeIdList(newStrokeIdList);
    setSelectedStrokeId(null);
  }

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  return (<>
    <div><h1><span className={indexStyles.red}>字</span>Button</h1></div>

    <div className={styles.characterDiv}>
      <h1>Study Mode</h1>
      <p>Click the button that shows the next character stroke.</p>

      <p className={styles.definition}><b>Definition</b>: {currentDef}, <b>Pinyin</b>: {currentPinyin}</p>

      <div className={`surfaceDiv ${styles.mainCharacterDisplay}`}>
      </div>
    </div>

    <div className={styles.buttonBar}>
      <div className={styles.correctDisplay} style={isCorrectStrokeShown ? {bottom: '0%'} : {bottom: '100%'}}>Correct!</div>
      <div className={styles.correctDisplay} style={isCharacterCompleteShown ? {bottom: '0%'} : {bottom: '100%'}}>Character complete!</div>
      <div className={styles.correctDisplay} style={isDoneShown ? {bottom: '0%'} : {bottom: '100%'}}>
        All characters complete!<br/>
        <a href={'index.html'}>Go back</a> or <a href={'study.html'}>Restart</a>
        </div>
      <div className={styles.incorrectDisplay} style={isIncorrectShown ? {bottom: '0%'} : {bottom: '100%'}}>Incorrect</div>

      <div className={styles.buttonWrapper}>{!isCharacterCompleteShown ? displayedStrokeIds.map(id => <StrokeButton key={id} strokeId={id} currentCharacter={currentCharacter} setSelectedStrokeId={setSelectedStrokeId} />) : ''}</div>
    </div>
  </>)
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<StudyPage />);