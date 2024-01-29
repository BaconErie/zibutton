/* Functions useful for server side */
'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

export async function dbGet(query, options) {
  /* Executes query and returns Promise that resolves to rows */
  const db = new sqlite3.Database(process.env.DB_PATH);
  return new Promise((resolve) => db.all(query, options, (err, rows) => {
    if (!rows && err)
      throw err;
    resolve(rows)
  }))
}

export async function hashPassword(plaintext) {
  return new Promise((resolve => {
    bcrypt.hash(plaintext, 12, function(_, hash) {
      resolve(hash);
    });
  }));
}

export async function verifyPassword(plaintext, hash) {
  return new Promise((resolve => {
    bcrypt.compare(plaintext, hash, function(_, result) {
      resolve(result);
    });
  }));
}

export async function generateToken(userId) {
  return jwt.sign({userId: userId}, process.env.TOKEN_SECRET);
}

export async function getUserIdFromToken() {
  /* Returns userId from token or null */
  const cookieStore = cookies()

  try {
    return jwt.verify(cookieStore.get('token').value, process.env.TOKEN_SECRET).userId;
  } catch {
    return null;
  }
}

export async function getUsername() {
  const cookieStore = cookies();

  if (cookieStore.get('username'))
    return cookieStore.get('username').value;
  else
    return null;
}

export async function getUsernameById(id) {
  const queryResult = await dbGet('SELECT username FROM users WHERE id=?', [id]);

  if (queryResult.length == 0)
    return null;
  else
    return queryResult[0].username;
}

export async function getListInfoFromId(listId) {
  const queryResult = await dbGet('SELECT name, ownerId, ownerUsername, timeCreated, lastUpdated, visibility FROM lists WHERE id=?', [listId]);
  const userId = await getUserIdFromToken();

  if (queryResult.length == 0) {
    return null;
  }
  else if (queryResult[0].visibility == 'private' && queryResult[0].ownerId != userId) {
    return null;
  } else {
    return queryResult[0];
  }
}