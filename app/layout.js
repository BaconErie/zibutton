import { Open_Sans } from 'next/font/google';
import '@/lib/ui/baconerie/styles/global.css';

const openSans = Open_Sans({
  weight: '500',
  subsets: ['latin']
});

export default async function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  );
}
