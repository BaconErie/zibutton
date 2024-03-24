'use client'
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme } = useTheme();

  setTheme('dark');

  return (
    <main>
      <h1 className="text-6xl sm:text-8xl lg:text-[10rem] text-center font-semibold block">
        Practice 漢字 stroke order without pen or paper
      </h1>
    </main>
  );
}
