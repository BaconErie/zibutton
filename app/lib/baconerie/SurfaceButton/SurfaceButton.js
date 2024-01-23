import React from 'react';

import styles from './SurfaceButton.module.css';

export default function SurfaceButton({ id, onClick, children, className }) {
  const stylesToUse = className ? `${styles.SurfaceButton_button} ${className}` : styles.SurfaceButton_button;

  return (<>

    <button id={id} onClick={onClick} className={stylesToUse}>
      <span className={styles.SurfaceButton_overlay}></span>
      {children}
    </button>
  </>)
}