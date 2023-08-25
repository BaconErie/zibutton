import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

import './global.css';
import styles from './Index.module.css';

import PrimaryButton from './components/baconerie/PrimaryButton/PrimaryButton';
import SurfaceButton from './components/baconerie/SurfaceButton/SurfaceButton';

function CharacterDisplay({ character, characterList, setCharacterList }) {
  function handleDeleteCharacter() {
    let newCharacterList = [...characterList];
    newCharacterList.splice(newCharacterList.indexOf(character), 1);
    setCharacterList(newCharacterList);
  }

  return (<li className={styles.characterDisplay}><SurfaceButton onClick={handleDeleteCharacter}>x</SurfaceButton> {character}</li>)
}

export default function MainComponent() {
  const [ characterList, setCharacterList ] = useState([]);
  const [ charInput , setCharInput ] = useState('');
  const [ disableAddChar , setDisableAddChar ] = useState(false);

  async function validateCharacter(char) {
    // Make sure the character exists
    const response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`);

    if (response.status == 200) {
        return true;
    } else {
        return false;
    }
  }

  async function handleAddCharacter() {
    setDisableAddChar(true);

    const inputCharacters = charInput.split('');
    let newCharacterList = [...characterList];
    let notFoundCharacters = [];

    for (const char of charInput) {
      if (char == '' || char == ' ' || newCharacterList.includes(char)) continue;
      
      if (!(await validateCharacter(char))) {
        notFoundCharacters.push(char);
        continue;
      }

      newCharacterList.push(char);
    }

    setCharacterList(newCharacterList);
    document.getElementById('characterInput').value = '';

    setDisableAddChar(false);

    if (notFoundCharacters.length > 0) {
      alert('The following characters were not found: ' + notFoundCharacters.join(', '));
    }
  }

  function handleClearList() {
    if (characterList.length == 0) return;

    if (confirm('Are you sure you want to delete everything in the list?')) {
      setCharacterList([]);
    }
  }

  const characterListItems = characterList.map(character => <CharacterDisplay key={character} character={character} characterList={characterList} setCharacterList={setCharacterList} />);

  return (<>
    <div><h1><span className={styles.red}>字</span>Button</h1></div>

    <div>
      <h1>Create a list</h1>
      <div class={styles.inputBar}>
        <input id="characterInput" type="text" placeholder="Enter a character" onInput={e => setCharInput(e.target.value)} disabled={disableAddChar}/>
        <span>
          <PrimaryButton onClick={handleAddCharacter} disabled={disableAddChar}>Add a character</PrimaryButton>
          <SurfaceButton>Import list</SurfaceButton>
          <SurfaceButton>Export list</SurfaceButton>
          <SurfaceButton onClick={handleClearList}>Clear all</SurfaceButton>
        </span>
      </div>

      <ul className={styles.characterList}>
        {characterListItems}
      </ul>
    </div>
  </>) 
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<MainComponent />); 