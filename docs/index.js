let numOfStrokes;
let writer;
let nextStroke = 0;
let strokeNumList = [];
let coreDiv = document.getElementById('core-div');
let buttons = document.getElementById('buttons');

let createListDiv = document.getElementById('create-list-div');
let charList = [];
let charInput = document.getElementById('character-input');
let charListDisplay = document.getElementById('character-list-display');
let charInputButton = document.getElementById('enter-character');
let currentCharIndex = 0;
let beginQuizButton = document.getElementById('begin-quiz');

let outlineCheckbox = document.getElementById('show-char');

let listUploadInput = document.getElementById('list-import');
let listExportButton = document.getElementById('list-export');

/***************
HELPER FUNCTIONS
***************/

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
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

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

/****
CORE
****/

async function loadCore(char){
    numOfStrokes = null;
    writer = null;
    nextStroke = 0;
    strokeNumList = [];

    document.getElementById('character-display').innerHTML = '';  
    buttons.innerHTML = '';

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
        buttons.appendChild(button);

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

function strokeButtonClicked(event) {
    let button = event.currentTarget
    let strokeNum = button.id;

    if (strokeNum == nextStroke) {
        writer.animateStroke(strokeNum);
        nextStroke++;
        button.style.visibility = 'hidden';

        if (nextStroke >= numOfStrokes) {
            if (currentCharIndex >= charList.length) {
                alert('You did everything right!');
            } else {
                alert('You did everythign right! Loading next question.');
                nextChar();
            }
        }
    } else {
        alert('Wrong stroke!');
    }
}

async function validateCharacter(char) {
    // Make sure the character exists
    response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`);

    if (response.status == 200) {
        return true;
    } else {
        return false;
    }
}

/***
LIST
***/

async function addCharacter(event) {
    let char = charInput.value;

    charInput.value = '';

    if (charList.includes(char)) {
        return;
    }

    // Make sure the character exists
    response = await fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`);

    if (response.status == 404) {
        alert('Character not found!');
        return;
    }
    else if (response.status != 200) {
        alert('Something went wrong. Please try again later.');
        return;
    }

    charList.push(char);

    let listItem = document.createElement('li');
    listItem.innerHTML = char + ' ';
    listItem.className = char;
    let removeButton = document.createElement('button');
    removeButton.addEventListener('click', deleteButtonHandler);
    removeButton.innerHTML = 'Remove';
    removeButton.className = char;
    listItem.appendChild(removeButton);
    
    charListDisplay.appendChild(listItem);
}

function deleteButtonHandler(event) {
    let elements = document.getElementsByClassName(event.currentTarget.className);
    for (let elem of elements) {
        elem.remove();
    }

    const index = charList.indexOf(event.currentTarget.className);
    if (index > -1) { // only splice array when item is found
        charList.splice(index, 1); // 2nd parameter means remove one item only
    }
}

function nextChar(event) {
    createListDiv.style.display = 'none';
    coreDiv.style.display = 'block';
    

    loadCore(charList[currentCharIndex]);
    currentCharIndex++;
}

function checkboxChanged(event) {
    let checked = outlineCheckbox.checked;

    if (checked) {
        writer.showOutline();
    } else {
        writer.hideOutline();
    }
    
}

/***************************
LIST IMPORTING AND EXPORTING
***************************/

async function importList() {
    const reader = new FileReader();
    const listFile = this.files[0];

    reader.addEventListener('load', (event) => {
        const listRaw = sanitize(event.target.result);
        const inputCharArray = listRaw.split('\n');

        for (const char of inputCharArray) {
            validateCharacter(char).then(charExists => {
                if (charExists) {
                    charList.push(char);

                    let listItem = document.createElement('li');
                    listItem.innerHTML = char + ' ';
                    listItem.className = char;
                    let removeButton = document.createElement('button');
                    removeButton.addEventListener('click', deleteButtonHandler);
                    removeButton.innerHTML = 'Remove';
                    removeButton.className = char;
                    listItem.appendChild(removeButton);
                    
                    charListDisplay.appendChild(listItem);
                }
            });
        }
    });

    reader.readAsText(listFile);
}

function exportList() {
    if (charList.length == 0) {
        alert('There\'s nothing to download...');
        return;
    }

    let fileString = '';

    charList.forEach(char => {
        fileString += char + '\n'
    })

    download('character-list.txt', fileString);
}

/****************
EVENT CONNECTIONS
****************/

charInputButton.addEventListener('click', addCharacter);

charInput.addEventListener('keyup', e => {
     if (e.code == 'Enter' && charInput.value.length != 0) {
        addCharacter(e);
    }});

beginQuizButton.addEventListener('click', nextChar);

outlineCheckbox.addEventListener('click', checkboxChanged);

listUploadInput.addEventListener('change', importList);
listExportButton.addEventListener('click', exportList);