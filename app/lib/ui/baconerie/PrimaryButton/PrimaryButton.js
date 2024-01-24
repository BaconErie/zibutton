import React from 'react';

import styles from './PrimaryButton.module.css';

export default function PrimaryButton({ id, type, className, onClick, children, disabled }) {
  let overlay = disabled ? null : (<span className={styles.PrimaryButton_overlay}></span>)
  const classNameToUse = className == undefined ? styles.PrimaryButton_button : styles.PrimaryButton_button + ' ' + className;

  return (<>
    <button id={id} type={type} onClick={onClick} className={classNameToUse} disabled={disabled}>
      {overlay}
      {children}
    </button>
  </>)
}