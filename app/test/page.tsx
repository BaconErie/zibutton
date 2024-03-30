'use client'

import HanziWriter from 'hanzi-writer';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

export default function TestPage() {
  const [ character, setCharacter ] = useState<string>('漢');
  const [ stroke, setStroke ] = useState<number>(3);

  return (<main>
    <h1>Hello world!</h1>

    <div className='w-3/6'>
      <Input className='text-6xl m-2 w-36 h-24' placeholder='character' value={character}  onChange={e => setCharacter(e.target.value)} />
      <Input className='text-6xl m-2 w-36 h-24' placeholder='stroke' value={stroke}  onChange={e => setStroke(parseInt(e.target.value))} />
    </div>

    <CharacterDisplay character={character} width={300} height={300} stroke={stroke} />
  </main>)
}

type CharacterDisplayProps = {
  character: string,
  width: number,
  height: number,
  stroke: number
}
function CharacterDisplay({ character, width, height, stroke }: CharacterDisplayProps) {
  const containerDiv = useRef<HTMLDivElement | null>(null);
  const [ writer, setWriter ] = useState<HanziWriter | null>(null);

  useEffect(() => {
    // Sets up the writer, and renders the initial character
    containerDiv.current!.innerHTML = '';

    const newWriter = new HanziWriter(containerDiv.current!, {
      padding: 5,
      width: width,
      height: height,
      showCharacter: false,
      strokeAnimationSpeed: 99999999999,
      showOutline: false
    });

    setWriter(newWriter);
  }, [])

  useEffect(() => {
    // Renders the character when the character is changed or when writer is changed
    // Returns if the writer has not been created yet

    if (!writer || character == '') return;
    
    writer.setCharacter(character);

    writer.animateStroke(stroke);

  }, [character, writer]);

  useEffect(() => {
    if (!writer || character == '') return;

    writer.updateDimensions({
      width: width,
      height: height
    })
  }, [width, height]);

  useEffect(() => {
    if (!writer || character == '') return;

    writer.animateStroke(stroke);
  }, [stroke]);
  
  return <div ref={containerDiv}></div>
}