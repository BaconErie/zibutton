'use client'
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme } = useTheme();

  setTheme('dark');

  return (
    <main>
      <h1 className="text-6xl sm:text-8xl lg:text-[10rem] text-center font-semibold block">Learn stuff without actually learning anything</h1>
    </main>
  );
}
