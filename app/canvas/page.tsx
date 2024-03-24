'use client'

import { useRef, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function CanvasTest() {
  const [ character, setCharacter ] = useState('漢');
  const [ source, setSource ] = useState('zh-hans');

  return (<main>
    Hello world!!
    <div className='w-3/6'>
      <Input className='text-6xl m-2 w-36 h-24' placeholder='character' value={character}  onChange={e => setCharacter(e.target.value)}/>

      <Select value={source} onValueChange={e => setSource(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="zh-hans">Chinese Simplified</SelectItem>
            <SelectItem value="zh-hant">Chinese Traditional</SelectItem>
            <SelectItem value="jp">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <CharacterDisplay character={character} source={source} settings={ {0: {color: '#ffffff', isAnimated: true}, 2: {color: '#ff0000', isAnimated: true} } } />
    </div>
  </main>)
}

type strokeSettings = {
  color: string,
  isAnimated: boolean
};

type strokeSettingsObject = {
  [strokeId: number]: strokeSettings
}

function CharacterDisplay({character, source, settings}: { character: string, source: string, settings: strokeSettingsObject }) {
  const canvasRef = useRef(null);
  const [ strokeStrings, setStrokeStrings ] = useState<string[]>([]);
  

  const [ medians, setMedians ] = useState<any[][]>([]); 
  
  async function useEffectMain() { 
    let urlToUse = '';

    switch (source) {
      case 'zh-hans':
        urlToUse = 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt';
        break;
      
      case 'zh-hant':
        urlToUse = 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsZhHant.txt';
        break;
      
      case 'jp':
        urlToUse = 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsJa.txt';
        break;

      case 'ko':
        urlToUse = 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/graphicsKo.txt';
        break;       
      
      default:
        urlToUse = source;
        break;
    }

    const characterData = await (await fetch(urlToUse, {cache: 'force-cache'})).text();

    // Split the data by line breaks
    // Each chunk is JSON data for a singular character
    // We need to parse each characterString and turn it into a JSON
    // Then check if its the stroke data for the chosen character
    const characterStrings: string[] = characterData.split('\n');
    let newStrokeStrings: string[] = []
    for (const characterString of characterStrings) {
      if (characterString != '') {
        const characterObject = JSON.parse(characterString);
        
        if (characterObject.character == character)
        {
          // Save the data for the character
          newStrokeStrings = characterObject.strokes;

          let newMedians: any[][] = [];
          for (const stroke of characterObject.medians) {
            let mediansForStroke: any[] = [];
            for (let i=0; i<stroke.length; i++) {
              const median = stroke[i];
              let newMedian = [];
              newMedian.push(median)

              if (i == 0) {
                newMedian.push(0);
              } else {
                // Calculate distance
                const prevMedianCoord = mediansForStroke[i-1][0];
                const prevMedianDistance = mediansForStroke[i-1][1];
                
                const distanceFromPrevMedian = Math.sqrt((prevMedianCoord[0] - median[0])**2 + (prevMedianCoord[1] - median[1])**2)
                newMedian.push(prevMedianDistance + distanceFromPrevMedian);
              }

              mediansForStroke.push(newMedian);
            }
            newMedians.push(mediansForStroke);
          }
          setMedians(newMedians);
          break;
        }
      }
    }
    
    setStrokeStrings(newStrokeStrings);
  }

  function onStrokeStringChange() {
    // Renders the strokes
    
    // Return if first load and the strokeStrings haven't been loaded yet
    if (strokeStrings.length == 0 || medians.length == 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = 1024;
    canvas.height = 1024;

    ctx.scale(1, -1);
    ctx.translate(0, -900);

    for (const strokeId of Object.keys(settings).map(key => parseInt(key))) {
      const settingsForStroke = settings[strokeId];
      ctx.fillStyle = settingsForStroke.color;

      const strokePath = new Path2D(strokeStrings[strokeId]);
      ctx.fill(strokePath);

      for (const median of medians[strokeId]) {
        console.log('hello', medians)
        ctx.beginPath();
        ctx.arc(median[0][0], median[0][1], 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
      }
    }
  }

  useEffect(() => {useEffectMain()}, [character, source]);
  useEffect(onStrokeStringChange, [strokeStrings])


  return (<canvas className='w-full' ref={canvasRef} />)
}