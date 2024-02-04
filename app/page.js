import Link from "next/link";
import PrimaryButton from "./lib/ui/baconerie/PrimaryButton/PrimaryButton";
import SurfaceButton from "./lib/ui/baconerie/SurfaceButton/SurfaceButton";

import styles from './index.module.css';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from "next/navigation";

export default function IndexPage()
{
  const cookieStore = cookies();
  const cookie = cookieStore.get('token');

  if (cookie) {
    try {
      jwt.verify(cookie.value, process.env.TOKEN_SECRET).userId;
      // If the jwt does not fail then token is verified

      try {
        redirect('/lists');
      } catch (e) {
        if (e.name != 'NEXT_REDIRECT')
          throw e
      }
    } catch (err){
      if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].indexOf(err.name) == -1)
        throw err; // throw non jwt errors
    }
  }

  return (<>
    <div className={styles.main}>
      <h1>Practice Chinese character stroke order with buttons, not pen or paper</h1>
      <br />
      <div className={'wrapper ' + styles.buttonWrapper}>
      <Link href="/login"><PrimaryButton>Login</PrimaryButton></Link>
      <Link href="/signup"><SurfaceButton>Sign up</SurfaceButton></Link>
      <Link href="https://github.com/BaconErie/zibutton"><SurfaceButton>Github Repo</SurfaceButton></Link>
      </div>
      <br /><br />
      <h1>How does 字Button work?</h1>
      <ol>
        <li>字Button shows you a hints about what the character is</li>
        <li>Select the button that has the next correct stroke</li>
        <li>Instantly get feedback, and practice until you learn the strokes!</li>
      </ol>
      <p>You can <Link href='/signup'>create an account</Link> to create lists, or you can study public lists that you have the link to without an account.</p>
    </div>
  </>);
}