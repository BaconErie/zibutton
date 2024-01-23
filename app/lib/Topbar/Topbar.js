import Link from 'next/link'
import topbarStyles from './Topbar.module.css';

export default function Topbar() {
  return (<div id={topbarStyles.topbarDiv}>
    <h1><span className={topbarStyles.red}>字</span>Button</h1>
    
    <div id={topbarStyles.topbarButtonWrapper} className={'wrapper'}>
      <Link href={'/login'}>Login</Link>
      <Link href={'/signup'}>Signup</Link>
    </div>
  </div>);
}