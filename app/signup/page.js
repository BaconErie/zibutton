'use client'

import { handleSignup } from './signupServer';
import { useState } from 'react';

import styles from '@/lib/ui/auth/auth.module.css';

import '@/lib/ui/auth/auth.css';
import PrimaryButton from '@/lib/ui/baconerie/PrimaryButton/PrimaryButton';

export default function SignupPage() {
  const [errorMessage, setErrorMessage] = useState('');

  async function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await handleSignup(username, password);
    
    if (result && result.error) {
      setErrorMessage(result.message);
    }
  }

  return (<>
    <div>
      <h1>Sign up</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor={'username'}>Username</label><br />
        <input required id={'username'} type={'text'} placeholder={'Username'} />
        <br />
        <label htmlFor={'password'}>Password</label><br />
        <input required id={'password'} type={'password'} placeholder={'Password'} />
        <br />
        <PrimaryButton type="submit">Sign up</PrimaryButton>
      </form>

      {
        errorMessage.length > 0 ? (
          <div id={styles.error} className={'surfaceDiv'}>{errorMessage}</div>
        ) : ''
      }
    </div>
  </>)
}