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
      <div className={style['page-shell']}>
        <div className="main-container">
          <div className={style['login-box']}>
            <div className={style['content-left']}>
              <Image
                alt="FansNest hero preview"
                className={style['hero-image']}
                fill
                priority
                quality={70}
                sizes="(max-width: 1024px) 100vw, 55vw"
                src={loginPlaceholderImage || '/auth-img.png'}
              />
              <div className={style['media-scrim']} />
              <div className={style['media-copy']}>
                <span className={style['media-eyebrow']}>Members-first creator access</span>
                <h2>Private access, premium drops, and recurring creator support.</h2>
                <p>
                  Everything should feel clear, direct, and fast on the first tap, especially on mobile.
                </p>
              </div>
            </div>
            <div className={style['content-right']}>
              <div className={style.logo}>
                <Logo />
              </div>
              <div className={style['welcome-copy']}>
                <span className={style.eyebrow}>Private creator platform</span>
                <h1>Memberships, messages, unlocks, and storefronts in one premium entry point.</h1>
                <p>
                  Fans move in seconds. Creators stay when onboarding, payouts, discovery, and private
                  access all feel effortless.
                </p>
                <div className={style['trust-row']}>
                  <span>Creator subscriptions</span>
                  <span>Private replies</span>
                  <span>Live sessions</span>
                  <span>Fast payouts</span>
                </div>
              </div>
              <SocialLoginGroup />
              <LoginForm />
            </div>
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
