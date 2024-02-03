'use client'

import { getUserIdFromToken } from '@/lib/helper';
import { useEffect, useState } from 'react';

import Toggle from '@/lib/ui/baconerie/Toggle/Toggle';
import PrimaryButton from '@/lib/ui/baconerie/PrimaryButton/PrimaryButton';
import SurfaceButton from '@/lib/ui/baconerie/SurfaceButton/SurfaceButton';
import CharacterDisplay from '@/lib/ui/CharacterDisplay/CharacterDisplay';

import styles from './createPage.module.css';
import { createList } from './editServer';

import { redirect } from 'next/navigation';


export default function CreatePage() {
  const [ errorMessage, setErrorMessage ] = useState(''); // Error message when submitting the list
  const [ listName, setListName ] = useState('');
  const [ characterList, setCharacterList ] = useState([]);
  const [ visibility, setVisibility ] = useState(false);
  const [ charInput, setCharInput ] = useState(''); // Stores the current character being inputted
  const [ disableAddChar, setDisableAddChar ] = useState(false); // Prevents addition of new characters while adding current one

  async function useEffectMain() {
    if (!(await getUserIdFromToken())) 
      redirect('/login');
  }

  useEffect(() => {
    useEffectMain();
  });

  /*  
    EVENT HANDLERS
  */

  async function handleListSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage('');

    const res = await createList(listName, visibility, characterList);

    if (res && res.error)
      setErrorMessage(res.message);
  }

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

    let newCharacterList = [...characterList];
    let notFoundCharacters = [];

    for (const char of charInput) {
      if (char == '' || char == ' ' || newCharacterList.includes(char)) 
        continue;
      
      if (!(await validateCharacter(char))) {
        notFoundCharacters.push(char);
        continue;
      }

      newCharacterList.push(char);
    }

    setCharacterList(newCharacterList);
    setCharInput('');

    setDisableAddChar(false);

    if (notFoundCharacters.length > 0) {
      alert('The following characters were not found: ' + notFoundCharacters.join(', '));
    }
  }

  async function handleImportList() {
    const fileContent = await upload();
    let charactersToAdd = fileContent.split('\n');
    charactersToAdd = charactersToAdd.map(char => char.trim());
    let newCharacterList = [...characterList];
    let notFoundCharacters = [];
    
    for (const char of charactersToAdd) {
      if (char == '' || char == ' ' || newCharacterList.includes(char)) 
        continue;
      
      if (!(await validateCharacter(char))) {
        notFoundCharacters.push(char);
        continue;
      }

      newCharacterList.push(char);
    }

    setCharacterList(newCharacterList);

    if (notFoundCharacters.length > 0) {
      alert('The following characters were not found: ' + notFoundCharacters.join(', '));
    }
  }

  function handleExportList() {
    if (characterList.length == 0) 
      return;

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().length==1 ? '0' + (date.getMonth()+1).toString() : (date.getMonth()+1).toString();
    const day = date.getDate().toString().length==1 ? '0' + date.getDate().toString() : date.getDate().toString();


    download(`character-list_${year}-${month}-${day}.txt`, characterList.join('\n'));
  }

  function handleClearList() {
    if (characterList.length == 0) 
      return;

    if (confirm('Are you sure you want to delete everything in the list?')) {
      setCharacterList([]);
    }
  }

  const characterListComponents = characterList.map(character => <CharacterDisplay key={character} character={character} characterList={characterList} setCharacterList={setCharacterList} />);

  return (<>
    <div>
      <h1>Create new list</h1>

      <form onSubmit={handleListSubmit}>
        <div className={styles.optionsBar}>
          <label required htmlFor={'listName'}>List name</label>
          <input required className={styles.flexGrow} id={'listName'} type={'text'} placeholder={'List name'} value={listName} onChange={(e) => setListName(e.target.value)}></input>
          <br />
          <label htmlFor={'visbility'}>Is list public?</label>
          <Toggle isActivated={visibility} setIsActivated={setVisibility} />
        </div>

        <br /><br />

        <div className={styles.inputBar}>
          <input className={styles.flexGrow} id="characterInput" type="text" placeholder="Enter a character" value={charInput} onInput={e => setCharInput(e.target.value)} disabled={disableAddChar}/>
          <span>
            <PrimaryButton onClick={handleAddCharacter} disabled={disableAddChar}>Add a character</PrimaryButton>
            <SurfaceButton onClick={handleImportList}>Import list</SurfaceButton>
            <SurfaceButton onClick={handleExportList}>Export list</SurfaceButton>
            <SurfaceButton onClick={handleClearList}>Clear all</SurfaceButton>
          </span>
        </div>

        <ul className={styles.characterList}>
          {characterListComponents}
        </ul>

        <PrimaryButton type={'submit'} className={styles.submitList}>Create list</PrimaryButton>
        <br /><br />
        {
        errorMessage.length > 0 ? (
          <div className={styles.error + ' surfaceDiv'}>{errorMessage}</div>
        ) : ''
        }

      </form>
    </div>
  </>)
}