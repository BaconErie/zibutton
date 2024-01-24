import Topbar from '@/lib/ui/Topbar/Topbar';
import { getUserIdFromToken, getUsername } from '@/lib/helper';

import { Open_Sans } from 'next/font/google';
import '@/lib/ui/baconerie/styles/global.css';

const openSans = Open_Sans({
  weight: '500',
  subsets: ['latin']
});

export default async function RootLayout({ children }) {
  const userId = await getUserIdFromToken();
  const username = await getUsername();

  return (
    <html lang='en'>
      <body className={openSans.className}>
        <Topbar username={userId ? username : null} />
        {children}
      </body>
    </html>
  );
}
