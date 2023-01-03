let numOfStrokes;
let writer;
let nextStroke = 0;
let strokeNumList = [];
let coreDiv = document.getElementById('core-div')

async function loadCore(char){
    writer = HanziWriter.create('character-display', char, {
        width: 100,
        height: 100,
        padding: 5,
        showCharacter: false,
        showOutline: false,
        strokeAnimationSpeed: 5
    });

    numOfStrokes = await HanziWriter.loadCharacterData(char);

    numOfStrokes = numOfStrokes['strokes'].length;

    for (let strokeNum = 0; strokeNum < numOfStrokes; strokeNum++) {
        strokeNumList.push(strokeNum);
    }

    shuffle(strokeNumList);

    for (let strokeNum of strokeNumList) {
        // Create the button
        let button = document.createElement('button');
        button.addEventListener('click', strokeButtonClicked);
        button.id = strokeNum;
        coreDiv.appendChild(button);

        let buttonWriter = HanziWriter.create(button, char, {
            width: 50,
            height: 50,
            padding: 2.5,
            showCharacter: false,
            showOutline: false
        })

        buttonWriter.animateStroke(strokeNum);
    }
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function strokeButtonClicked(event) {
    let button = event.currentTarget
    let strokeNum = button.id;

    if (strokeNum == nextStroke) {
        writer.animateStroke(strokeNum);
        nextStroke++;
        button.style.visibility = 'hidden';

        if (nextStroke >= numOfStrokes) {
            alert('You did everything right!')
        }
    } else {
        alert('Wrong stroke!');
    }
}

loadCore('我')
