'use server'

import { redirect } from "next/navigation";
import { dbGet, getUserIdFromToken } from "@/lib/helper";

export async function getListInfoFromId(listId) {
  let queryResult = await dbGet('SELECT name, ownerId, ownerUsername, timeCreated, lastUpdated, visibility, characterList FROM lists WHERE id=?', [listId]);
  const userId = await getUserIdFromToken();

  if (queryResult.length == 0) {
    return null;
  }
  else if (queryResult[0].visibility == 'private' && queryResult[0].ownerId != userId) {
    return null;
  } else {
    queryResult[0].characterList = queryResult[0].characterList.split('');
    return queryResult[0];
  }
}