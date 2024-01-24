'use client'

import { handleSignup } from './signupServer';

import '../login/login.css';
import PrimaryButton from '@/lib/ui/baconerie/PrimaryButton/PrimaryButton';

export default function SignupPage() {
  function handleFormSubmit(e) {
    e.preventDefault();

    const username = e.target.getElementById('username');
    const password = e.target.getElementById('password');

    handleLogin(username, password);
  } 

  return (<>
    <div>
      <h1>Sign up</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor={'username'}>Username</label><br />
        <input id={'username'} type={'text'} placeholder={'Username'} />
        <br /><br />
        <label htmlFor={'password'}>Password</label><br />
        <input id={'password'} type={'password'} placeholder={'Password'} />
        <br />
        <PrimaryButton type="submit">Sign up</PrimaryButton>
      </form>
    </div>
  </>)
}