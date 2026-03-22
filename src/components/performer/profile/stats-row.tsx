import {
  FireOutlined,
  HeartOutlined, PictureOutlined, ShoppingOutlined, UsergroupAddOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import { IPerformer } from '@interfaces/performer';
import { shortenLargeNumber } from '@lib/number';

import style from './stats-row.module.scss';

type Props = {
  performer: IPerformer;
};

function StatsRow({
  performer
}: Props) {
  const stats = [
    {
      label: 'Posts',
      value: shortenLargeNumber(performer.stats?.totalFeeds || 0),
      icon: <FireOutlined />
    },
    {
      label: 'Videos',
      value: shortenLargeNumber(performer.stats?.totalVideos || 0),
      icon: <VideoCameraOutlined />
    },
    {
      label: 'Photos',
      value: shortenLargeNumber(performer.stats?.totalPhotos || 0),
      icon: <PictureOutlined />
    },
    {
      label: 'Store',
      value: shortenLargeNumber(performer.stats?.totalProducts || 0),
      icon: <ShoppingOutlined />
    },
    {
      label: 'Likes',
      value: shortenLargeNumber(performer.stats?.likes || 0),
      icon: <HeartOutlined />
    },
    {
      label: 'Fans',
      value: shortenLargeNumber(performer.stats?.subscribers || 0),
      icon: <UsergroupAddOutlined />
    }
  ];

  return (
    <div className={style['stats-row']}>
      <div className={style['tab-stat']}>
        {stats.map((item) => (
          <div className={style['tab-item']} key={item.label}>
            <span className={style.value}>
              {item.icon}
              {item.value}
            </span>
            <small>{item.label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsRow;
