import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function GET() {
  cookies().delete('username');
  cookies().delete('token');

  try {
    redirect('/login');
  } catch (e) {
    if (e.name != 'NEXT_REDIRECT')
      throw e;
  }
}