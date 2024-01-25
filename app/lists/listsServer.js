'use server';

import { dbGet, getUserIdFromToken } from "@/lib/helper";
import { redirect } from "next/navigation";

export async function getLists() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return [];
  }

  const queryResult = await dbGet('SELECT id, name, ownerId, ownerUsername FROM lists WHERE ownerId=?', [userId]);
  return queryResult;
}