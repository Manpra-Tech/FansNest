import { ArrowLeftOutlined } from '@ant-design/icons';
import SeoMetaHead from '@components/common/seo-meta-head';
import {
  IFeed
} from '@interfaces/index';
import { feedService } from '@services/index';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import FeedCard from '@components/post/card/feed-card';
import PageHeading from '@components/common/page-heading';

interface IProps {
  feed: IFeed;
}

function PostDetails({
  feed
}: IProps) {
  return (
    <>
      <SeoMetaHead pageTitle={`${feed?.slug || ''}`} />
      <div className="main-container">
        <PageHeading title="Back" icon={<ArrowLeftOutlined />} />
        <div className="main-container custom">
          <FeedCard feed={feed} />
        </div>
      </div>
    </>
  );
}

PostDetails.authenticate = true;
PostDetails.noredirect = true;

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = nextCookie(ctx);
    const res = await feedService.findOne(ctx.query.id, {
      Authorization: token || ''
    });
    return {
      props: {
        feed: res.data
      }
    };
  } catch {
    return { notFound: true };
  }
};

export default PostDetails;
