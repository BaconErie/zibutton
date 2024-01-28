import Link from "next/link";

export default function ListDisplay({ id, listName, ownerName, ownerId }) {
  return (<>
    <div className={'surfaceDiv'}>
      <Link href={'/view/' + id}><h2>{listName}</h2></Link>
      <br />
      <p>Created by <Link href={'/lists/' + ownerId}>{ownerName}</Link></p>
    </div>
  </>)
}