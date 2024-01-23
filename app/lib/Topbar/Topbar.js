import Link from 'next/link'
import topbarStyles from './Topbar.module.css';

export default function Topbar({ username }) {
  let buttons;

  if (username) {
    buttons = (<>
      <b><div className={'wrapper'}>{username}</div></b>
      <Link href={'/signup'}>Logout</Link>
    </>)
  } else {
    buttons = (<>
      <Link href={'/login'}>Login</Link>
      <Link href={'/signup'}>Signup</Link>
    </>)
  }

  return (<div id={topbarStyles.topbarDiv}>
    <h1><span className={topbarStyles.red}>字</span>Button</h1>
    
    <div id={topbarStyles.topbarButtonWrapper} className={'wrapper'}>
      {buttons}
    </div>
  </div>);
}