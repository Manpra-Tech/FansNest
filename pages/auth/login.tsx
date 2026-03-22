import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next/types';
import Image from 'next/image';
import { useEffect } from 'react';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import Router from 'next/router';
import style from './login.module.scss';

const SocialLoginGroup = dynamic(() => import('@components/auth/social-login-group'));
const LoginForm = dynamic(() => import('@components/auth/login-form'));
const Logo = dynamic(() => import('@components/common/base/logo'), { ssr: false });

type Props = {
  title: string;
  metaKeywords: string;
  metaDescription: string;
  loginPlaceholderImage: string;
};

function Login({
  title,
  metaKeywords,
  metaDescription,
  loginPlaceholderImage
}: Props) {
  const handleLoggedInRedirect = async () => {
    const token = authService.getToken();
    if (!token) return;
    try {
      const user = await userService.me({
        Authorization: token || ''
      });

      if (user.data.isPerformer) {
        Router.push(`/${user.data.username}`);
        return;
      }
      Router.push('/home');
    } catch (e) {
      authService.removeToken();
    }
  };

  useEffect(() => {
    handleLoggedInRedirect();
  }, []);

  return (
    <>
      <SeoMetaHead
        pageTitle={title || 'Login'}
        keywords={metaKeywords}
        description={metaDescription}
      />
      <div className="main-container">
        <div className={style['login-box']}>
          <div className={`${style['content-left']}`}>
            <Image
              alt="welcome-placeholder"
              fill
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 2100px) 40vw"
              src={loginPlaceholderImage || '/auth-img.png'}
            />
          </div>
          <div className={`${style['content-right']}`}>
            <div className={style.logo}>
              <Logo />
            </div>
            <div className={style['welcome-copy']}>
              <span className={style.eyebrow}>FansNest demo access</span>
              <h1>Login in seconds and demo fans, creators, and management revenue from one polished local flow.</h1>
              <p>
                This local workspace is seeded for a strong walkthrough: creator discovery, premium drops,
                private messages, subscriptions, and admin visibility all feel connected.
              </p>
              <div className={style['trust-row']}>
                <span>Verified creators</span>
                <span>Private chat + paid drops</span>
                <span>Public management console ready</span>
              </div>
            </div>
            <SocialLoginGroup />
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

Login.authenticate = false;
Login.layout = 'public';

export const getServerSideProps = async (ctx: NextPageContext) => {
  const meta = await settingService.valueByKeys([
    'homeTitle',
    'homeMetaKeywords',
    'homeMetaDescription',
    'loginPlaceholderImage'
  ]);
  return {
    props: {
      title: meta?.homeTitle || '',
      metaKeywords: meta?.homeMetaKeywords || '',
      metaDescription: meta?.homeMetaDescription || '',
      loginPlaceholderImage: meta?.loginPlaceholderImage || ''
    }
  };
};

export default Login;
