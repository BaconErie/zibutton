'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'

import { dbGet, hashPassword, generateToken } from '@/lib/helper';



export async function handleSignup(username, password) {
  const rows = await dbGet('SELECT username FROM users WHERE username=?', [username]);

  if (rows.length != 0) {
    return {
      error: true,
      message: 'Username is already in use.'
    }
  }

  // Check if username is alphanumeric, and only one underscore and in the middle
  let underscoreExists = false;
  for (let i = 0; i < username.length; i++) {
    let code = username.charCodeAt(i);

    if (username.charAt(i) == '_') {
      if (underscoreExists)
        return {
          error: true,
          message: 'Your username can only contain one underscore.'
        }
      if (i == 0 || i == username.length-1)
        return {
          error: true,
          message: 'Your username cannot begin or end with an underscore.'
        }
      
      underscoreExists = true;
    } else if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) { // lower alpha (a-z)
      
      return {
        error: true,
        message: 'Username can only contain letters, numbers, or underscore.'
      }
    }
  }

  if (password.length < 8)
    return {
      error: true,
      message: 'Password must be at least 8 characters long.'
    }
  
  const hashed_password = await hashPassword(password);

  await dbGet('INSERT INTO users (username, password, time_created) VALUES (?, ?, ?)', [username, hashed_password, Math.floor(Date.now()/1000)]);

  const dbRes = await dbGet('SELECT id FROM USERS WHERE username=?', [username]);
  const userId = dbRes[0].id;
  const token = generateToken(userId);

  cookies().set('token', token);

  redirect('/');
}