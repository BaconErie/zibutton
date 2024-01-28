'use server';

import { dbGet, getUserIdFromToken } from "@/lib/helper";

export async function getLists() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return [];
  }

  const queryResult = await dbGet('SELECT id, name, ownerId, ownerUsername FROM lists WHERE ownerId=?', [userId]);
  return queryResult;
}

export async function getListsByUserId(ownerId) {
  if (!ownerId)
    return;

  const userId = await getUserIdFromToken();
  
  let queryResult;
  if (ownerId == userId)
    queryResult = await dbGet('SELECT id, name, ownerId, ownerUsername FROM lists WHERE ownerId=?', [userId]);
  else
    queryResult = await dbGet('SELECT id, name, ownerId, ownerUsername FROM lists WHERE ownerId=? AND visibility=\'public\'', [ownerId]);
  
  return queryResult;
}