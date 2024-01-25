import Link from "next/link";

export default function ListDisplay({ id, listName, ownerName, ownerId }) {
  return (<>
    <div>
      <Link href={'/view/' + id}><h2>{listName}</h2></Link>

      <p>Created by</p>
      <p><Link href={'/lists/' + ownerId}>{ownerName}</Link></p>
    </div>
  </>)
}