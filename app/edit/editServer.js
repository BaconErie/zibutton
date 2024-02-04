'use server';

import { dbGet, getUserIdFromToken, getUsername } from "@/lib/helper";

export async function createList(listName, visibility, characterList) {
  const userId = await getUserIdFromToken();
  const username = await getUsername();

  if (!userId || !username) {
    return {
      error: true,
      message: 'Not authorized.'
    };
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

  return {
    error: false,
    message: 'Success',
    listId: listId
  };
}

export async function editExisitingList(listId, listName, visibility, characterList) {
  const userId = await getUserIdFromToken();
  const ownerId = (await dbGet('SELECT ownerId FROM lists WHERE id=?', [listId]))[0].ownerId;

  if (ownerId != userId)
    return {
      error: true,
      message: 'Not authorized.'
    };

  // List must now exist and the owner == user

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
  
  let res = await dbGet('SELECT id FROM lists WHERE name=? AND ownerId=? AND id!=?', [listName, userId, listId]);
  if (res.length != 0)
    return {
      error: true,
      message: 'Another list with that same name exists.'
    };
  
  const visibilityString = visibility ? 'public' : 'private';
  
  await dbGet('UPDATE lists SET name=?, visibility=?, characterList=?, lastUpdated=? WHERE id=?', [listName, visibilityString, characterList.join(''), Math.floor(Date.now()/1000), listId]);

  return {
    error: false,
    message: 'Success',
    listId: listId
  };
}
 