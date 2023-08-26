import React from 'react';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

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

export default function IndexPage() {
  const [ characterList, setCharacterList ] = useState([]);
  const [ charInput , setCharInput ] = useState('');
  const [ disableAddChar , setDisableAddChar ] = useState(false);

  useEffect( () => {
    if (localStorage.getItem('characterList') != null && localStorage.getItem('characterList') != '') {
      setCharacterList(localStorage.getItem('characterList').split(','))
    }
  }, []);

  useEffect( () => {
    localStorage.setItem('characterList', characterList);
  }, [characterList]);

  async function validateCharacter(char) {
    // Make sure the character exists
    const response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`);

    if (response.status == 200) {
        return true;
    } else {
        return false;
    }
  }

  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  async function upload() {
    const promise = new Promise((resolve, _) => {

        let input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => { 

            // getting a hold of the file reference
            let file = e.target.files[0]; 

            // setting up the reader
            let reader = new FileReader();
            reader.readAsText(file,'UTF-8');

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
                let content = readerEvent.target.result; // this is the content!
                resolve(content);
            }

        }

        input.click();
    })

    return promise;
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

  async function handleImportList() {
    setDisableAddChar(true);

    const fileContent = await upload();
    let charactersToAdd = fileContent.split('\n');
    charactersToAdd = charactersToAdd.map(char => char.trim());
    let newCharacterList = [...characterList];
    let notFoundCharacters = [];
    
    for (const char of charactersToAdd) {
      if (char == '' || char == ' ' || newCharacterList.includes(char)) continue;
      
      if (!(await validateCharacter(char))) {
        notFoundCharacters.push(char);
        continue;
      }

      newCharacterList.push(char);
    }

    setCharacterList(newCharacterList);

    setDisableAddChar(false);

    if (notFoundCharacters.length > 0) {
      alert('The following characters were not found: ' + notFoundCharacters.join(', '));
    }
  }

  function handleExportList() {
    if (characterList.length == 0) return;

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().length==1 ? '0' + (date.getMonth()+1).toString() : (date.getMonth()+1).toString();
    const day = date.getDate().toString().length==1 ? '0' + date.getDate().toString() : date.getDate().toString();


    download(`character-list_${year}-${month}-${day}.txt`, characterList.join('\n'));
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
      <p>
        Add some characters, then click the "Start Quiz" button at the bottom.
      </p>
      <p>
        Characters are saved to your browser, but may disappear on its own. Export and save your list to keep it safe.
      </p>

      <div class={styles.inputBar}>
        <input id="characterInput" type="text" placeholder="Enter a character" onInput={e => setCharInput(e.target.value)} disabled={disableAddChar}/>
        <span>
          <PrimaryButton onClick={handleAddCharacter} disabled={disableAddChar}>Add a character</PrimaryButton>
          <SurfaceButton onClick={handleImportList}>Import list</SurfaceButton>
          <SurfaceButton onClick={handleExportList}>Export list</SurfaceButton>
          <SurfaceButton onClick={handleClearList}>Clear all</SurfaceButton>
        </span>
      </div>

      <ul className={styles.characterList}>
        {characterListItems}
      </ul>

      <PrimaryButton onClick={() => window.location.assign('study.html')}>Start Quiz</PrimaryButton>
    </div>
  </>) 
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<IndexPage />); 