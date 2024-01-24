/* Functions useful for server side */
'use server'

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

export async function dbGet(query, options) {
  /* Executes query and returns Promise that resolves to rows */
  const db = new sqlite3.Database(process.env.DB_PATH);
  return new Promise((resolve) => db.all(query, options, (_, rows) => resolve(rows)))
}

export async function hashPassword(plaintext) {
  return new Promise((resolve => {
    bcrypt.hash(plaintext, 12, function(_, hash) {
      resolve(hash);
    });
  }));
}

export async function generateToken(userId) {
  return jwt.sign({userId: userId, issueTime: Date.now()/1000}, process.env.TOKEN_SECRET);
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