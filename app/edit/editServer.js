'use server';

import { dbGet, getUserIdFromToken, getUsername } from "@/lib/helper";
import { redirect } from "next/navigation";

export async function createList(listName, visibility, characterList) {
  const userId = await getUserIdFromToken();
  const username = await getUsername();

  if (!userId || !username) {
    redirect('/login');
  }

  if (!listName)
    return {
      error: true,
      message: 'You need to enter a name for your list.'
    };
  
  if (!characterList || characterList.length == 0)
    return {
      error: true,
      message: 'You need to put something in your list.'
    };
  
  let res = await dbGet('SELECT id FROM lists WHERE name=? AND ownerId=?', [listName, userId]);
  if (res.length != 0)
    return {
      error: true,
      message: 'List with that name already exists.'
    };
  
  const visibilityString = visibility ? 'public' : 'private'; // true = public, false = private
  const characterListString = characterList.join('');  

  await dbGet('INSERT INTO lists (ownerId, ownerUsername, name, timeCreated, lastUpdated, visibility, characterList) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, username, listName, Math.floor(Date.now()/1000), Math.floor(Date.now()/1000), visibilityString, characterListString]);
  res = await dbGet('SELECT id FROM lists WHERE name=?', [listName]);
  const listId = res[0].id;

  redirect('/view/' + listId);
}
 