import { PrintButton } from './client'

export default function ListsPage({ params }) {
  
  console.log('This should be on the server side, so this is the userId: ' + params.userId);

  return (<>
    <div>
      This is a test!!!!!!

      HELP
    </div>
  </>);
}