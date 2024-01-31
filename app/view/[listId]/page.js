'use client'

import { getUserIdFromToken } from "@/lib/helper";
import { getListInfoFromId } from "./viewServer";

import { useState, useEffect } from 'react';

import styles from './view.module.css';

import Link from 'next/link';
import CharacterDisplay from '@/lib/ui/CharacterDisplay/CharacterDisplay';
import PrimaryButton from "@/lib/ui/baconerie/PrimaryButton/PrimaryButton";

export default function ViewList({ params }) {
  const [listName, setListName] = useState('');
  const [ownerId, setOwnerId] = useState(0);
  const [ownerUsername, setOwnerUsername] = useState('');
  const [visibility, setVisibility] = useState('');
  const [timeCreatedUnix, setTimeCreatedUnix] = useState('');
  const [lastUpdatedUnix, setLastUpdatedUnix] = useState('');
  const [ characterList, setCharacterList ] = useState([]);
  const [ userId, setUserId ] = useState(0);

  async function useEffectMain() {
    const queryResult = await getListInfoFromId(params.listId);

    if (!queryResult)
      return;

    setListName(queryResult.name);
    setOwnerId(queryResult.ownerId);
    setOwnerUsername(queryResult.ownerUsername);
    setVisibility(queryResult.visibility);
    setTimeCreatedUnix(queryResult.timeCreated);
    setLastUpdatedUnix(queryResult.lastUpdated);
    setCharacterList(queryResult.characterList);
    setUserId(await getUserIdFromToken());
  }

  useEffect(() => {
    useEffectMain();
  });

  function parseDate(unixTimeSeconds) {
    // why doesnt js have this
    const dateObj = new Date(unixTimeSeconds * 1000);
    let res = '';

    res += ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dateObj.getDay()];
    res += ', '

    res += ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObj.getMonth()];
    res += ' ';

    res += dateObj.getDate();
    res += ', '

    res += dateObj.getFullYear();
    res += ' ';

    res += dateObj.getHours();
    res += ':'

    if (dateObj.getMinutes() <= 9)
      res += '0' + dateObj.getMinutes();
    else
      res += dateObj.getMinutes();

    return res;
  }

  return (<>
    <div>
      <h1>View list</h1>
      <h2>{listName}</h2>
      <Link href={'/study/' + params.listId}><PrimaryButton className={styles.button}>Study List</PrimaryButton></Link>
      {userId == ownerId ? (<Link href={'/edit/' + params.listId}><PrimaryButton className={styles.button}>Edit list</PrimaryButton></Link>) : null} 
      <ul className={styles.characterList}>
        {characterList.map(character => <CharacterDisplay key={character} character={character} characterList={null} setCharacterList={null} />)}
      </ul>

      <div className={styles.infoBar + ' wrapper'}>
        <div className={'surfaceDiv'}><b>Created by:</b><br /><Link href={'/lists/' + ownerId}>{ownerUsername}</Link></div>
        <div className={'surfaceDiv'}><b>Date Created:</b><br />{parseDate(timeCreatedUnix)}</div>
        <div className={'surfaceDiv'}><b>Last updated:</b><br />{parseDate(lastUpdatedUnix)}</div>
        <div className={'surfaceDiv'}><b>Visibility:</b><br />{visibility}</div>
      </div>
    </div>
  </>)
}