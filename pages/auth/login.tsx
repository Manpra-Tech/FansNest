import SeoMetaHead from '@components/common/seo-meta-head';
import { settingService } from '@services/setting.service';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next/types';
import Image from 'next/image';
import Link from 'next/link';
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
  const signalCards = [
    {
      label: 'For fans',
      value: 'One-tap access',
      meta: 'Follow, message, subscribe, unlock'
    },
    {
      label: 'For creators',
      value: 'Multiple revenue lanes',
      meta: 'Memberships, live, messages, storefronts'
    },
    {
      label: 'Premium feel',
      value: 'Fast and mobile-first',
      meta: 'Clean discovery, private replies, smooth return visits'
    }
  ];

  const previewCards = [
    {
      eyebrow: 'Memberships',
      title: 'Private subscriptions that feel clear from the first glance.',
      description: 'Fans should understand access, value, and what unlocks next in seconds.',
      image: '/default-banner.jpeg',
      badge: 'Subscriptions'
    },
    {
      eyebrow: 'Live + direct',
      title: 'Messages, live sessions, and priority replies in one rhythm.',
      description: 'Creators need repeatable touchpoints. Fans need direct access that feels worth returning to.',
      image: '/stream.jpg',
      badge: 'Direct access'
    },
    {
      eyebrow: 'Commerce',
      title: 'Storefronts, bundles, and exclusive drops without friction.',
      description: 'The platform should move naturally from discovery into paid moments and retained support.',
      image: '/card-bg.jpg',
      badge: 'Creator revenue'
    }
  ];

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
                <span className={style['media-eyebrow']}>Premium creator memberships</span>
                <h2>Private communities, direct access, and creator revenue in one polished flow.</h2>
                <p>
                  Fans decide fast. The product has to feel trustworthy, modern, and effortless from the
                  first scroll.
                </p>
              </div>
              <div className={style['signal-grid']}>
                {signalCards.map((item) => (
                  <div className={style['signal-card']} key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.meta}</p>
                  </div>
                ))}
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
              <div className={style['path-row']}>
                <Link className={`${style['path-link']} ${style.primary}`} href="/auth/register">
                  Start as a fan
                </Link>
                <Link className={`${style['path-link']} ${style.secondary}`} href="/auth/creator-register">
                  Become a creator
                </Link>
              </div>
              <SocialLoginGroup />
              <LoginForm />
            </div>
          </div>
          <section className={style['platform-preview']}>
            <div className={style['section-copy']}>
              <span>Inside FansNest</span>
              <h2>Move from discovery to paid access without losing momentum.</h2>
              <p>
                Each surface should do one job well: create trust, show creator value, and make the next
                action obvious.
              </p>
            </div>
            <div className={style['preview-grid']}>
              {previewCards.map((card) => (
                <article className={style['preview-card']} key={card.title}>
                  <div className={style['preview-media']}>
                    <Image
                      alt={card.title}
                      fill
                      quality={75}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      src={card.image}
                    />
                    <span className={style['preview-badge']}>{card.badge}</span>
                  </div>
                  <div className={style['preview-body']}>
                    <span className={style['preview-eyebrow']}>{card.eyebrow}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
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
