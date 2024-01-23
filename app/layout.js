import Topbar from '@/lib/Topbar/Topbar';

import { Open_Sans } from 'next/font/google';
import '@/lib/baconerie/styles/global.css';

const openSans = Open_Sans({
  weight: '500',
  subsets: ['latin']
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={openSans.className}>
        <Topbar />
        {children}
      </body>
    </html>
  );
}
