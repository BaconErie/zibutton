'use client'

import { getUsername } from '@/lib/helper';
import { getLists } from './listsServer';

import ListDisplay from './ListDisplay';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListsPage() {
  const [ lists, setLists ] = useState([]);
  const [ username, setUsername ] = useState(null);
  const [ debounce, setDebounce ] = useState(false);

  async function useEffectMain() {
    if (debounce)
      return;

    setUsername(await getUsername());
    setLists(await getLists());
    setDebounce(true);
  }

  useEffect(() => {
    useEffectMain();
  })
  

  if (!username) {
    return (<>
      <div>
        <h1>Your lists</h1>
        <p>You must be logged in to create and view your lists, but you can study lists without logging in.</p>

        <p><Link href='/login'>Login page</Link></p>
      </div>
    </>); 
  }

  return (<>
    <div>
      <h1>Your lists</h1>

      {lists.length==0 ? (<p>You have no lists. Why not create one now?</p>) : ''}

      {lists.map(listRow => (
          <ListDisplay id={listRow.id} listName={listRow.name} ownerName={listRow.ownerUsername} ownerId={listRow.ownerId} />
      ))}
    </div>
  </>);
}