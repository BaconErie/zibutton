'use client'

import { getUsernameById } from '@/lib/helper';
import { getListsByUserId } from '../listsServer';

import ListDisplay from '../ListDisplay';

import { useEffect, useState } from 'react';

import styles from '../lists.module.css';

export default function ListsWithUserIdPage({ params }) {
  const [ lists, setLists ] = useState([]);
  const [ username, setUsername ] = useState(null);
  const [ debounce, setDebounce ] = useState(false);

  async function useEffectMain() {
    if (debounce)
      return;

    const username = await getUsernameById(params.userId);

    if (!username)
      return;
    
    setUsername(username);
    setLists(await getListsByUserId(params.userId));
    setDebounce(true);
  }

  useEffect(() => {
    useEffectMain();
  }, [])
  
  if (!username)
    (<div>
      <h1>User's lists</h1>

      <p>User not found</p>
    </div>)
  
  return (<>
    <div>
      <h1>
        {username}'s lists
      </h1>

      {lists.length==0 ? (<p>{username} has no public lists</p>) : ''}

      <div className={styles.listsTable + ' wrapper'}>
        {lists.map(listRow => (
            <ListDisplay key={listRow.id} id={listRow.id} listName={listRow.name} ownerName={listRow.ownerUsername} ownerId={listRow.ownerId} />
        ))}
      </div>
    </div>
  </>);
}