import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export function GET() {
  cookies().delete('username');
  cookies().delete('token');
  redirect('/login');
}