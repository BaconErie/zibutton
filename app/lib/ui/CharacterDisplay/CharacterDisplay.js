import SurfaceButton from "@/lib/ui/baconerie/SurfaceButton/SurfaceButton";

export default function CharacterDisplay({ character, characterList, setCharacterList }) {
  function handleDeleteCharacter() {
    let newCharacterList = [...characterList];
    newCharacterList.splice(newCharacterList.indexOf(character), 1);
    setCharacterList(newCharacterList);
  }

  if (!characterList || !setCharacterList)
    return (<li>{character}</li>)
  else
    return (<li><SurfaceButton onClick={handleDeleteCharacter}>x</SurfaceButton> {character}</li>)
}