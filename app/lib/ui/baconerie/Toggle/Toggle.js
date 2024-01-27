import styles from './Toggle.module.css';

export default function Toggle({ isActivated, setIsActivated }) {
  return (<>
    <label className={styles.switch}>
      <input className={styles.input} type={'checkbox'} onChange={e => {e.stopPropagation();setIsActivated(!isActivated)}} defaultChecked={isActivated}/>
      <span className={styles.slider}></span>
    </label>
    
  </>)
}