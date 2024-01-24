'use client'

import { handleLogin } from './loginServer';

import './login.css';
import PrimaryButton from '@/lib/ui/baconerie/PrimaryButton/PrimaryButton';

export default function LoginPage() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const username = e.target.getElementById('username');
    const password = e.target.getElementById('password');

    handleLogin(username, password);
  } 

  return (<>
    <div>
      <h1>Login</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor={'username'}>Username</label><br />
        <input id={'username'} type={'text'} placeholder={'Username'} />
        <br /><br />
        <label htmlFor={'password'}>Password</label><br />
        <input id={'password'} type={'password'} placeholder={'Password'} />
        <br />
        <PrimaryButton type="submit">Login</PrimaryButton>
      </form>
    </div>
  </>)
}