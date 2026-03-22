import dynamic from 'next/dynamic';

import { Divider } from 'antd';
import style from './social-login-group.module.scss';

const TwitterLoginButton = dynamic(() => import('@components/auth/twitter-login-button'));
const GoogleLoginButton = dynamic(() => import('@components/auth/google-login-button'));

export function SocialLoginGroup() {
  return (
    <div className={style['social-login']}>
      <TwitterLoginButton />
      <GoogleLoginButton />
      <Divider>Or</Divider>
    </div>
  );
}

export default SocialLoginGroup;
