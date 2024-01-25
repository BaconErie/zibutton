'use client'

import { useEffect, useState } from 'react';

import Topbar from '@/lib/ui/Topbar/Topbar';
import { getUserIdFromToken, getUsername } from '@/lib/helper';

export default function Template({ children }) {
  const [ username, setUsername ] = useState(null); 

  useEffect(() => {
    console.log("hey guys")

    getUsername().then((username) => setUsername(username));
  })

  return (<>
    <Topbar username={username ? username : null} />
    {children}
  </>)
}