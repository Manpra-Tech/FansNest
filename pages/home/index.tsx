import {
  CloseOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  WalletOutlined
} from '@ant-design/icons';
import {
  bannerService
} from '@services/index';
import {
  Alert, Button, Input
} from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { connect } from 'react-redux';
import {
  IBanner, ISettings, IUser
} from 'src/interfaces';
import SeoMetaHead from '@components/common/seo-meta-head';
import { skeletonLoading } from '@lib/loading';

import style from './home.module.scss';

const Banners = dynamic(() => import('@components/common/banner'));
const HomePerformers = dynamic(() => import('@components/performer/list/home-listing'));
const StreamActiveItems = dynamic(() => import('@components/streaming/list/active-list-items'));
const ScrollListFeed = dynamic(() => import('@components/post/list/scroll-list'), { ssr: false, loading: skeletonLoading });

interface IProps {
  banners: IBanner[];
  settings: ISettings;
  user: IUser;
}

function HomePage({
  user, settings, banners
}: IProps) {
  const [keyword, setKeyword] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [totalFeeds, setTotalFeeds] = useState(-1);
  const [feedType, setFeedType] = useState('');
  const [audienceMode, setAudienceMode] = useState('for-you');

  const onSearchFeed = debounce(async (e) => {
    setKeyword(e);
  }, 600);

  const topBanners = banners && banners.length > 0 && banners.filter((b) => b.position === 'top');
  const heroStats = [
    {
      label: 'Audience mode',
      value: audienceMode === 'for-you' ? 'For You' : audienceMode === 'following' ? 'Following' : audienceMode === 'trending' ? 'Trending' : 'Latest'
    },
    {
      label: 'Feed drops',
      value: totalFeeds >= 0 ? `${totalFeeds}` : 'Loading'
    },
    {
      label: 'Subscriptions',
      value: settings.freeSubscriptionEnabled ? 'Free + paid' : 'Paid only'
    }
  ];
  const heroTrust = ['Mobile-first flow', 'Verified creators', 'Private chat + paid drops'];
  const quickActions = user?.isPerformer ? [
    {
      href: '/creator/my-post/create',
      title: 'Drop a post',
      description: 'Publish a paid teaser, subscriber update, or daily hook in seconds.',
      icon: <ThunderboltOutlined />
    },
    {
      href: '/creator/live',
      title: 'Go live',
      description: 'Turn urgency into revenue with live rooms, DMs, and immediate fan pull.',
      icon: <PlayCircleOutlined />
    },
    {
      href: '/creator/earning',
      title: 'Track earnings',
      description: 'See what is converting today and where your next payout is coming from.',
      icon: <WalletOutlined />
    }
  ] : [
    {
      href: '/creator',
      title: 'Discover creators',
      description: 'Jump straight into high-trust profiles with live energy and clear pricing.',
      icon: <ThunderboltOutlined />
    },
    {
      href: '/messages',
      title: 'Open messages',
      description: 'Pick up private chats, locked replies, and subscriber-only conversations fast.',
      icon: <MessageOutlined />
    },
    {
      href: '/wallet',
      title: 'Top up wallet',
      description: 'Keep subscriptions, unlocks, and tips frictionless once you are hooked.',
      icon: <WalletOutlined />
    }
  ];
  const roleFocus = user?.isPerformer
    ? {
      eyebrow: 'Creator command strip',
      title: 'Your next move should be obvious: post, go live, or check what is converting.',
      detail: 'Creators need speed, clarity, and income signals more than extra clutter.'
    }
    : {
      eyebrow: 'Fan quick path',
      title: 'Fans decide fast. Discovery, trust, and private access should all be one tap away.',
      detail: 'The first three seconds should make the next action feel inevitable.'
    };

  return (
    <>
      <SeoMetaHead pageTitle="Home" />
      <div className={classNames(
        style['home-page']
      )}
      >
        <Banners banners={topBanners} />
        <div className="main-container">
          <div className={style['home-heading']}>
            <div className={style['left-side']}>
              <h3>
                HOME
              </h3>
            </div>
            <div className={style['search-bar-feed']}>
              <Input
                className={openSearch ? style.active : ''}
                prefix={<SearchOutlined />}
                placeholder="Type to search here ..."
                onChange={(e) => {
                  e.persist();
                  onSearchFeed(e.target.value);
                }}
              />
              <a aria-hidden className={style['open-search']} onClick={() => setOpenSearch(!openSearch)}>
                {!openSearch ? <SearchOutlined /> : <CloseOutlined />}
              </a>
            </div>
          </div>
          <div className={style['home-container']}>
            <div className={style['left-container']}>
              <div className={style['hero-panel']}>
                <div className={style['hero-copy']}>
                  <span className={style.eyebrow}>FansNest demo spotlight</span>
                  <h2>{user?.isPerformer ? 'Turn every drop, DM, and live room into revenue from one polished command surface.' : 'Live creators. Premium drops. Private moments. Everything that should hook in three seconds.'}</h2>
                  <p>
                    The local POC is now seeded to feel fuller: creator discovery, richer feed density, private chat touchpoints,
                    subscriptions, and commerce all sit inside the same experience.
                  </p>
                  <div className={style['hero-trust']}>
                    {heroTrust.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <div className={style['hero-stats']}>
                  {heroStats.map((item) => (
                    <div key={item.label} className={style['hero-stat-card']}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className={style['role-strip']}>
                <div className={style['role-copy']}>
                  <span className={style.eyebrow}>{roleFocus.eyebrow}</span>
                  <h3>{roleFocus.title}</h3>
                  <p>{roleFocus.detail}</p>
                </div>
                <div className={style['quick-actions']}>
                  {quickActions.map((item) => (
                    <Link href={item.href} key={item.href} className={style['quick-action-card']}>
                      <span className={style.icon}>{item.icon}</span>
                      <strong>{item.title}</strong>
                      <small>{item.description}</small>
                    </Link>
                  ))}
                </div>
              </div>
              <div className={style['mobile-discover-wrap']}>
                <HomePerformers variant="shelf" showFooter={false} />
              </div>
              {user._id && !user.verifiedEmail && settings.requireEmailVerification && <Link href={user.isPerformer ? '/creator/account' : '/user/account'}><Alert type="error" style={{ margin: '15px 0', textAlign: 'center' }} message="Please verify your email address, click here to update!" /></Link>}
              <StreamActiveItems />
              <div className={style['discovery-toolbar']}>
                <div className={style['toolbar-intro']}>
                  <span>{user?.isPerformer ? 'Creator lens' : 'Fan lens'}</span>
                  <strong>
                    {user?.isPerformer
                      ? 'This is the live storefront your fans should feel instantly.'
                      : totalFeeds >= 0 ? `${totalFeeds} drops rotating right now.` : 'Loading the next wave of drops.'}
                  </strong>
                </div>
                <div className={style['audience-wrapper']}>
                  <Button className={classNames({ active: audienceMode === 'for-you' })} onClick={() => setAudienceMode('for-you')}>For You</Button>
                  <Button className={classNames({ active: audienceMode === 'following' })} onClick={() => setAudienceMode('following')}>Following</Button>
                  <Button className={classNames({ active: audienceMode === 'trending' })} onClick={() => setAudienceMode('trending')}>Trending</Button>
                  <Button className={classNames({ active: audienceMode === 'latest' })} onClick={() => setAudienceMode('latest')}>Latest</Button>
                </div>
                <div className={style['filter-wrapper']}>
                  <Button className={classNames({ active: feedType === '' })} onClick={() => setFeedType('')}>All Posts</Button>
                  <Button className={classNames({ active: feedType === 'text' })} onClick={() => setFeedType('text')}>Text</Button>
                  <Button className={classNames({ active: feedType === 'video' })} onClick={() => setFeedType('video')}>Video</Button>
                  <Button className={classNames({ active: feedType === 'photo' })} onClick={() => setFeedType('photo')}>Photos</Button>
                  <Button className={classNames({ active: feedType === 'audio' })} onClick={() => setFeedType('audio')}>Audio</Button>
                  <Button className={classNames({ active: feedType === 'scheduled-streaming' })} onClick={() => setFeedType('scheduled-streaming')}>Scheduled Streaming</Button>
                </div>
              </div>
              {totalFeeds === 0 && (
                <div className="main-container custom text-center" style={{ margin: '10px 0' }}>
                  <Alert
                    type="warning"
                    message={(
                      <Link href="/creator">
                        <SearchOutlined />
                        {' '}
                        Fresh drops are syncing. Explore trending creators while the next release loads in.
                      </Link>
                    )}
                  />
                </div>
              )}
              <ScrollListFeed
                query={{
                  q: keyword,
                  isHome: true,
                  type: feedType,
                  audience: audienceMode
                }}
                getTotal={(t) => setTotalFeeds(t)}
              />
            </div>
            <div className={style['right-container']} id="home-right-container">
              <HomePerformers />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

HomePage.authenticate = true;
HomePage.noredirect = true;
HomePage.layout = 'home';

export const getServerSideProps = async () => {
  const [banners] = await Promise.all([
    bannerService.search({ limit: 99 })
  ]);
  return {
    props: {
      banners: banners?.data?.data || []
    }
  };
};

const mapStates = (state: any) => ({
  user: { ...state.user.current },
  settings: { ...state.settings }
});

const mapDispatch = {};
export default connect(mapStates, mapDispatch)(HomePage);
