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
  const [ totalStrokes, setTotalStrokes ] = useState<number>(0);
  const [ settings, setSettings ] = useState({})

  useEffect(() => {
    if (totalStrokes == 0) return;

    let newSettings: strokeSettingsObject = {};

    for (let i=0; i<totalStrokes; i++) {
      newSettings[i] = {color: '#ffffff', isAnimated: false};
    }

    setSettings(newSettings);
  }, [totalStrokes]);

  return (<main>
    Hello world!!
    <div className='w-3/6'>
      <Input className='text-6xl m-2 w-36 h-24' placeholder='character' value={character}  onChange={e => setCharacter(e.target.value)}/>

      <Select value={source} onValueChange={e => {setSource(e);}}>
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

      <CharacterDisplay character={character} source={source} settings={settings} setTotalStrokes={setTotalStrokes} />
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

type medianPoint = {
  coord: [number, number],
  length: number
}

function CharacterDisplay({character, source, settings, setTotalStrokes}: { character: string, source: string, settings: strokeSettingsObject, setTotalStrokes?: any }) {
  const canvasRef = useRef(null);
  const [ strokeStrings, setStrokeStrings ] = useState<string[]>([]);
  const [ medians, setMedians ] = useState<medianPoint[][]>([]);
  const [ medianLengths, setMedianLengths ] = useState<number[]>([]);
  const [ strokePercentage, setStrokePercentage ] = useState<number>(1);
  
  async function useEffectMain() {
    // Triggered when the character or source is changed
    // Resets the strokePercentage to 0, which then triggers the render function
    
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

          let newMedians: medianPoint[][] = [];
          let newMedianLengths: number[] = [];
          for (const stroke of characterObject.medians) {
            let mediansForStroke: medianPoint[] = [];
            let medianLengthForCurrentStroke = 0;
            for (let i=0; i<stroke.length; i++) {
              const medianCoord = stroke[i];
              let newMedianPoint: medianPoint;

              if (i == 0) {
                newMedianPoint = {coord: medianCoord, length: 0};
              } else {
                // Calculate distance
                const prevMedianCoord = mediansForStroke[i-1].coord;
                const prevMedianLength = mediansForStroke[i-1].length;
                
                const distanceFromPrevMedian = Math.sqrt((prevMedianCoord[0] - medianCoord[0])**2 + (prevMedianCoord[1] - medianCoord[1])**2)
                newMedianPoint = {coord: medianCoord, length: prevMedianLength + distanceFromPrevMedian};
                medianLengthForCurrentStroke += distanceFromPrevMedian;
              }

              mediansForStroke.push(newMedianPoint);
            }
            newMedians.push(mediansForStroke);
            newMedianLengths.push(medianLengthForCurrentStroke);
          }
          setMedians(newMedians);
          setMedianLengths(newMedianLengths);

          if (setTotalStrokes) {
            setTotalStrokes(newStrokeStrings.length);
          }

          break;
        }
      }
    }
    
    setStrokeStrings(newStrokeStrings);
    setStrokePercentage
  }

  function onStrokePercentageChange() {
    alert(1);

    // Renders the strokes
    
    // Return if first load and the strokeStrings haven't been loaded yet
    if (strokeStrings.length == 0 || medians.length == 0 || medianLengths.length == 0 || strokePercentage == 1) return;
    alert(2);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = 1024;
    canvas.height = 1024;

    ctx.scale(1, -1);
    ctx.translate(0, -900);

    for (const strokeId of Object.keys(settings).map(key => parseInt(key))) {   
      const settingsForStroke = settings[strokeId];
      ctx.strokeStyle = settingsForStroke.color;
      ctx.lineWidth = 100;
      const strokePath = new Path2D(strokeStrings[strokeId]);
      ctx.save();
      ctx.clip(strokePath);

      const lengthToDraw = medianLengths[strokeId] * strokePercentage;
      const mediansForStroke: medianPoint[] = medians[strokeId];

      if (!mediansForStroke) continue;

      for (let i = 0; i < mediansForStroke.length; i++) {
        if (i == 0) continue;

        const medianPoint: medianPoint = mediansForStroke[i];
        const prevMedianPoint: medianPoint = mediansForStroke[i-1];

        if (medianPoint.length <= lengthToDraw) {
          ctx.beginPath();
          ctx.moveTo(prevMedianPoint.coord[0], prevMedianPoint.coord[1]);
          ctx.lineTo(medianPoint.coord[0], medianPoint.coord[1]);
          ctx.stroke();
        } else {
          // Partially draw from the previous medianPoint to the current one.
          // The line from previous medianPoint to the point in between the previous and current medianPoint will be called partialMedian

          // First, find the length of the normal, complete median as well as the length of the partial median.
          const completeMedianLength = medianPoint.length - prevMedianPoint.length;
          const partialMedianLength = lengthToDraw - prevMedianPoint.length;

          // Then, divide the two numbers to find the percentageOfMedianComplete
          // This is not the same as strokePercentage
          const percentageOfMedianComplete = partialMedianLength/completeMedianLength;

          // Finally, multiply the x and y differences from prevMedianPoint to medianPoint by percentageOfMedianComplete
          // and then add these to prevMedian point.
          // This will be the resulting point to draw to
          const xDiff = medianPoint.coord[0] - prevMedianPoint.coord[0];
          const yDiff = medianPoint.coord[1] - prevMedianPoint.coord[1];

          const resultingX = xDiff * percentageOfMedianComplete + prevMedianPoint.coord[0];
          const resultingY = yDiff * percentageOfMedianComplete + prevMedianPoint.coord[1];

          // Draw the partial median

          ctx.beginPath();
          ctx.moveTo(prevMedianPoint.coord[0], prevMedianPoint.coord[1]);
          ctx.lineTo(resultingX, resultingY);
          ctx.stroke();
          
          break;
        }
      }

      ctx.restore();
    }

    // Set a timeout to increase the stroke percentage by 1% after 10 miliseconds
    const timer = setTimeout(() => {
      setStrokePercentage(strokePercentage + 0.01);
    }, 10);

    // React requirement: Return a function that, when called, clears the timeout
    // This function will be called when the component is unloaded
    return () => clearTimeout(timer);
  }

  useEffect(() => {useEffectMain()}, [character, source]);
  useEffect(onStrokePercentageChange, [strokePercentage])


  return (<canvas className='w-full' ref={canvasRef} />)
}