/* Functions useful for server side */

import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';

export function getUserIdFromToken() {
  /* Returns userId from token or null */
  const cookieStore = cookies()

  try {
    return jwt.verify(cookieStore.get('token').value, process.env.TOKEN_SECRET).userId;
  } catch {
    return null;
  }
}