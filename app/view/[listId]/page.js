'use client'

import { getListInfoFromId } from "@/lib/helper";

import { useState, useEffect } from 'react';

import Link from 'next/link';

export default function ViewList({ params }) {
  const [ listName, setListName ] = useState('');
  const [ ownerId, setOwnerId ] = useState('');
  const [ ownerUsername, setOwnerUsername ] = useState('');
  const [ visibility, setVisibility ] = useState('');
  const [ timeCreatedUnix, setTimeCreatedUnix ] = useState('');
  const [ lastUpdatedUnix, setLastUpdatedUnix ] = useState('');

  async function useEffectMain() {
    const queryResult = await getListInfoFromId(params.listId);

    if (!queryResult)
      redirect('/not-found');
    
    setListName(queryResult.listName);
    setOwnerId(queryResult.ownerId);
    setOwnerUsername(queryResult.ownerUsername);
    setVisibility(queryResult.visibility);
    setTimeCreatedUnix(queryResult.timeCreated);
    setLastUpdatedUnix(queryResult.lastUpdated); 
  }

  useEffect(() => {
    useEffectMain();
  });

  function parseDate(unixTimeSeconds) {
    // why doesnt js have this
    const dateObj = new Date(unixTimeSeconds*1000);
    let res = '';

    res += ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dateObj.getDay()];
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
    <h1>{listName}</h1>

    <div>
      <div>Created by:<Link href={'/lists/' + ownerId}>{ownerUsername}</Link></div>
      <div>Date Created: {parseDate(timeCreatedUnix)}</div>
      <div>Last updated: {parseDate(lastUpdatedUnix)}</div>
      <div>Visibility: {visibility}</div>
    </div>
  </>)
}