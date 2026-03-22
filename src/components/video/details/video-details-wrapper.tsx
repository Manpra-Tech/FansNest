import {
  CalendarOutlined,
  EyeOutlined, HourglassOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import PageHeading from '@components/common/page-heading';
import PerformerAvatar from '@components/performer/performer-avatar';
import ReactionButtons from '@components/action-buttons/reaction-buttons';
import { IVideo } from '@interfaces/video';
import { formatDate } from '@lib/date';
import { videoDuration } from '@lib/duration';
import { shortenLargeNumber } from '@lib/number';
import { useState } from 'react';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { skeletonLoading } from '@lib/loading';
import style from './video-details-wrapper.module.scss';
import VideoMiddleWrapper from './video-middle-wrapper';

const VideoDetailPlayer = dynamic(() => import('./video-player'));
const VideoTabs = dynamic(() => import('./video-tabs'), { ssr: false, loading: skeletonLoading });
const RelatedVideos = dynamic(() => import('./related-videos'), { ssr: false, loading: skeletonLoading });

type Props = {
  video: IVideo
};

function VideoDetailsWrapper({
  video
}: Props) {
  const [activeTab, setActiveTab] = useState('description');

  const onChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="main-container">
      <PageHeading icon={<VideoCameraOutlined />} title={video.title || 'Video'} />
      <div className={style['vid-duration']}>
        <span className={style.stats}>
          <HourglassOutlined />
          &nbsp;
          {videoDuration(video?.video?.duration || 0)}
          &nbsp;&nbsp;&nbsp;
          <EyeOutlined />
          &nbsp;
          {shortenLargeNumber(video.stats.views || 0)}
        </span>
        <span className={style.stats}>
          <CalendarOutlined />
          &nbsp;
          {formatDate(video.updatedAt, 'll')}
        </span>
      </div>
      <VideoDetailPlayer video={video} />
      <VideoMiddleWrapper video={video} />
    </div>
  );
}

export default VideoDetailsWrapper;
