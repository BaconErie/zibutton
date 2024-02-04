'use server'

import { cookies } from 'next/headers';

import { dbGet, verifyPassword, generateToken } from '@/lib/helper';

export async function handleLogin(username, password) {
  const rows = await dbGet('SELECT id, password FROM users WHERE username=?', [username]);

  if (rows.length == 0)
    return {
      error: true,
      message: 'Username or password is incorrect.'
    }
  
  const userId = rows[0].id;
  const hash = rows[0].password;
  
  const didPasswordPass = await verifyPassword(password, hash);

  if (!didPasswordPass)
    return {
      error: true,
      message: 'Username or password is incorrect.'
    }
  
  const token = await generateToken(userId);
  
  cookies().set('token', token);
  cookies().set('username', username);

  return {
    error: false,
    message: 'Success'
  }
}