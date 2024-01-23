'use client'

export function PrintButton({ userId }) {

  function clickHandler() {
    console.log("LOLLLL CLINET SDIE LLLL")
    alert('Hi you clicked. This the user id: ' + userId);
  }

  return (<button onClick={clickHandler}>{userId}</button>);
}