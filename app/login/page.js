'use client'

import { handleLogin } from './loginServer';
import { useState } from 'react';

import styles from '@/lib/ui/auth/auth.module.css';
import '@/lib/ui/auth/auth.css';

import PrimaryButton from '@/lib/ui/baconerie/PrimaryButton/PrimaryButton';
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  async function handleFormSubmit(e) {
    setErrorMessage('');
    e.preventDefault();
    e.stopPropagation();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await handleLogin(username, password);
    
    if (result && result.error) {
      setErrorMessage(result.message);
    } else if (result && !result.error) {
      
      router.push('/lists');
    }
  }

  return (<>
    <div>
      <h1>Login</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor={'username'}>Username</label><br />
        <input required id={'username'} type={'text'} placeholder={'Username'} />
        <br />
        <label htmlFor={'password'}>Password</label><br />
        <input required id={'password'} type={'password'} placeholder={'Password'} />
        <br />
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>

      {
        errorMessage.length > 0 ? (
          <div id={styles.error} className={'surfaceDiv'}>{errorMessage}</div>
        ) : ''
      }
    </div>
  </>)
}