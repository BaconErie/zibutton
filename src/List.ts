import BaseController from "./BaseController";

export enum Language {
    JA,
    CNzh
}

function createEmptyProgress(): [Set<string>, Set<string>, Set<string>, Set<string>, Set<string>] {
    return [new Set(), new Set(), new Set(), new Set(), new Set()];
}

export class List {
    id: number;
    _name: string;
    ownerName: string;
    language: Language;
    _characters: string[];
    _progress: [Set<string>, Set<string>, Set<string>, Set<string>, Set<string>];
    levelOfCharacter: {[key: string]: number} = {};
    controller: BaseController;

    constructor(
        id: number, 
        name: string, 
        ownerName: string, 
        language: Language,
        characters: string[] = [],
        progress: [Set<string>, Set<string>, Set<string>, Set<string>, Set<string>] = createEmptyProgress(),
        controller: BaseController,
    ) {
        this.id = id;
        this._name = name;
        this.ownerName = ownerName;
        this.language = language;
        this._characters = characters;
        this._progress = progress;
        this.controller = controller;

        this.updateLevelOfCharacter();
    }

    updateLevelOfCharacter(): void {
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
        this.controller.saveList(this);
    }

    get characters(): string[] {
        return this._characters;
    }

    addCharacter(character: string): void {
    }

    /**
     * Gets a character to study
     */
    getCharacter(): string {
        for (const level of this._progress) {
            if (level.size <= 0) {continue;}
            
            return level.values().next().value!;
        }

        return '';
    }

    removeCharacter(character: string): void {
        // Remove the character from the characters array
        const index = this._characters.indexOf(character);
        if (index > -1) {
            this._characters.splice(index, 1);
        }
        
        // Remove the character from the progress sets
        const levelIndex = this.levelOfCharacter[character];
        this._progress[levelIndex].delete(character);

        // Remove the character from the levelOfCharacter map
        delete this.levelOfCharacter[character];

        this.controller.saveList(this);
    }

    get progress(): [Set<string>, Set<string>, Set<string>, Set<string>, Set<string>] {
        return this._progress;
    }

    set progress(progress: [Set<string>, Set<string>, Set<string>, Set<string>, Set<string>]) {
        this._progress = progress;
        this.controller.saveList(this);
    }

    /**
     * Promotes a character to the next level. Call when the character is correct.
     * Also saves the list
     * @param character 
     */
    promoteCharacter(character: string): void {
        const characterLevel = this.levelOfCharacter[character];
        
        if (characterLevel == 3) {
            return; // Already at max level
        }

        // Remove the character from the current level, add it on the next level
        this._progress[characterLevel].delete(character)
        this._progress[characterLevel + 1].add(character)
        this.levelOfCharacter[character] = characterLevel + 1;

        this.controller.saveList(this);
    }


    /**
     * Demotes a charcter to either 0 or 1, depending on accuracy.
     * Call when the character is incorrect.
     * Also saves the list
     * @param character
     * @param isOverHalfCorrect If true, demote to level 1, otherwise to level 0.
     */
    demoteCharacter(character: string, isOverHalfCorrect: boolean): void {
        const characterLevel = this.levelOfCharacter[character];

        if ((characterLevel == 0 && !isOverHalfCorrect) || (characterLevel == 1 && isOverHalfCorrect)) {
            return; // Already at correct level
        }

        // Remove the character from the current level, add it on the previous level
        this._progress[characterLevel].delete(character);


        if (isOverHalfCorrect) {
            this._progress[1].add(character);
            this.levelOfCharacter[character] = 1;
        } else {
            this._progress[0].add(character);
            this.levelOfCharacter[character] = 0;
        }

        this.controller.saveList(this);
    }


}