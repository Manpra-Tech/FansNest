import {
  SyncOutlined, TagOutlined, LeftOutlined, RightOutlined
} from '@ant-design/icons';
import { showError } from '@lib/utils';
import { performerService } from '@services/performer.service';
import {
  Button, Carousel, Tooltip
} from 'antd';
import { chunk } from 'lodash';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IPerformer } from 'src/interfaces';

import classNames from 'classnames';
import { ImageWithFallback } from '@components/common';
import PerformerCard from '../card/card';
import style from './home-listing.module.scss';

const HomeFooter = dynamic(() => (import('@components/common/footer')), { ssr: false });

const DISCOVERY_MODES = [
  { key: 'popular', label: 'Trending' },
  { key: 'live', label: 'Live' },
  { key: 'latest', label: 'Latest' },
  { key: 'free', label: 'Free' }
];

interface IProps {
  variant?: 'rail' | 'shelf';
  showFooter?: boolean;
}

export function HomePerformers({ variant = 'rail', showFooter = true }: IProps) {
  const [performers, setPerformers] = useState<IPerformer[]>([]);
  const [fetching, setFetching] = useState(true);
  const [mode, setMode] = useState('popular');
  const user = useSelector((state: any) => state.user.current);
  const carouselRef = useRef() as any;

  const getPerformers = async () => {
    try {
      setFetching(true);
      const query = {
        limit: variant === 'shelf' ? 8 : 12,
        sortBy: mode === 'free' ? 'popular' : mode,
        ...(mode === 'free' ? { isFreeSubscription: true } : {})
      };
      const data = await (
        await performerService.search(query)
      ).data.data;
      setPerformers(data.filter((p) => p._id !== user._id));
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getPerformers();
  }, [mode, variant]);

  const chunkPerformers = chunk(performers, 4);

  return (
    <div className={classNames(style['suggestion-bl'], { [style.shelf]: variant === 'shelf' })}>
      <div className={style['sug-top']}>
        <div className={style['title-wrap']}>
          <span className={style['sug-text']}>DISCOVER CREATORS</span>
          <small className={style['sug-subtext']}>
            {variant === 'shelf'
              ? 'Swipe fast-moving creators with clear value, trust, and live energy.'
              : 'Fast-reply profiles, clear pricing, and live energy upfront.'}
          </small>
        </div>
        <div className={style['btns-grp']}>
          {DISCOVERY_MODES.map((item) => (
            <Tooltip title={`Show ${item.label.toLowerCase()} creators`} key={item.key}>
              <Button onClick={() => setMode(item.key)}>
                {item.key === 'free' ? <TagOutlined /> : null}
                <span className={classNames('free-txt', { active: mode === item.key })}>
                  {item.label}
                </span>
              </Button>
            </Tooltip>
          ))}
          <Tooltip title="Refresh">
            <Button onClick={() => getPerformers()}>
              <SyncOutlined spin={fetching} />
            </Button>
          </Tooltip>
          {variant === 'rail' && (
            <>
              <Button onClick={() => carouselRef.current && carouselRef.current.prev()}><LeftOutlined /></Button>
              <Button onClick={() => carouselRef.current && carouselRef.current.next()}><RightOutlined /></Button>
            </>
          )}
          <Link href="/creator">
            <Button>See all</Button>
          </Link>
        </div>
      </div>
      {variant === 'shelf' ? (
        <div className={style['shelf-track']}>
          {performers.map((performer) => {
            const subscriptionLabel = performer?.isFreeSubscription
              ? 'Free entry'
              : `$${Number(performer?.monthlyPrice || 0).toFixed(2)}/month`;
            const metrics = [
              `${performer?.subscriberCount || 0} members`,
              `${performer?.mediaCount || 0} drops`,
              performer?.live > 0 ? 'Live now' : performer?.responseTime || 'Replies within 24h'
            ];

            return (
              <Link
                href={{
                  pathname: '/[profileId]',
                  query: { profileId: performer?.username || performer?._id }
                }}
                as={`/${performer?.username || performer?._id}`}
                key={performer._id}
                className={style['compact-card']}
              >
                <div className={style['compact-cover-wrap']}>
                  <ImageWithFallback
                    options={{
                      width: 420,
                      height: 260,
                      quality: 40,
                      className: style['compact-cover'],
                      sizes: '(max-width: 767px) 75vw, 320px'
                    }}
                    src={performer?.cover || '/default-banner.jpeg'}
                    fallbackSrc="/default-banner.jpeg"
                    alt="creator-cover"
                  />
                  <span className={style['compact-price']}>{subscriptionLabel}</span>
                  {performer?.live > 0 ? <span className={style['compact-live']}>Live</span> : null}
                </div>
                <div className={style['compact-meta']}>
                  <div className={style['compact-identity']}>
                    <ImageWithFallback
                      options={{
                        width: 72,
                        height: 72,
                        quality: 30,
                        className: style['compact-avatar'],
                        sizes: '(max-width: 767px) 15vw, 72px'
                      }}
                      src={performer?.avatar || '/no-avatar.jpg'}
                      fallbackSrc="/no-avatar.jpg"
                      alt="creator-avatar"
                    />
                    <div className={style['compact-copy']}>
                      <strong>{performer?.name}</strong>
                      <span>{`@${performer?.username || 'creator'}`}</span>
                    </div>
                  </div>
                  <p>{performer?.bio || 'Premium creator profile with subscriber access, private drops, and fast replies.'}</p>
                  <div className={style['compact-chips']}>
                    {metrics.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="sug-content">
          <Carousel
            autoplay
            autoplaySpeed={5000}
            adaptiveHeight
            ref={carouselRef}
            swipeToSlide
            arrows={false}
            dots={false}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {chunkPerformers.length > 0 && chunkPerformers.map((arr: any, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={`newaa_${index}`}>
                {arr.length > 0 && arr.map((p) => <PerformerCard performer={p} key={p._id} />)}
              </div>
            ))}
          </Carousel>
        </div>
      )}
      {!fetching && !performers?.length && <p className="text-center">No creators were found</p>}
      {showFooter && (
        <div className={classNames(style['home-footer'], {
          [style.active]: true
        })}
        >
          <HomeFooter customId="home-footer" />
        </div>
      )}
    </div>
  );
}

export default HomePerformers;
