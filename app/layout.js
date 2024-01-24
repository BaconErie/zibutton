import Topbar from '@/lib/ui/Topbar/Topbar';
import { getUserIdFromToken } from '@/lib/helper';

import { Open_Sans } from 'next/font/google';
import '@/lib/ui/baconerie/styles/global.css';

const openSans = Open_Sans({
  weight: '500',
  subsets: ['latin']
});

export default function RootLayout({ children }) {
  const userId = getUserIdFromToken();
  console.log(userId)
  return (
    <html lang='en'>
      <body className={openSans.className}>
        <Topbar username={userId} />
        {children}
      </body>
    </html>
  );
}
