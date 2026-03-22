import PageHeading from '@components/common/page-heading';
import SeoMetaHead from '@components/common/seo-meta-head';
import PerformerGridCard from '@components/performer/card/grid-card';
import dynamic from 'next/dynamic';
import {
  Col, Pagination, Row, Spin
} from 'antd';
import { useEffect, useState } from 'react';
import { ModelIcon } from 'src/icons';
import { performerService } from 'src/services';
import { showError } from '@lib/utils';
import { StyleProvider } from '@ant-design/cssinjs';
import style from './index.module.scss';

const PerformerAdvancedFilter = dynamic(() => import('@components/performer/common/performer-advanced-filter'));

function Performers() {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(16);
  const [filter, setFilter] = useState({ sortBy: 'live' });
  const [performers, setPerformers] = useState([]);
  const [total, setTotal] = useState(0);
  const [fetching, setFetching] = useState(true);

  const getPerformers = async () => {
    try {
      setFetching(true);
      const resp = await performerService.search({
        limit,
        offset: limit * offset,
        ...filter
      });
      setPerformers(resp.data.data);
      setTotal(resp.data.total);
    } catch (e) {
      showError(e);
    } finally {
      setFetching(false);
    }
  };

  const handleFilter = (values) => {
    setOffset(0);
    setFilter({ ...filter, ...values });
  };

  useEffect(() => {
    getPerformers();
  }, [filter, offset, limit]);

  const pageChanged = async (page: number, pageSize: number) => {
    setOffset(page - 1);
    setLimit(pageSize);
  };

  return (
    <>
      <SeoMetaHead pageTitle="Creators" />
      <div className="main-container">
        <div className={style['creator-hero']}>
          <div className={style['hero-copy']}>
            <span className={style.eyebrow}>Discover faster</span>
            <h1>Find creators with clear value, live energy, and a next step that feels obvious.</h1>
            <p>Fans need trust, pricing, and chemistry in seconds. This view is now tighter so discovery feels like product, not admin work.</p>
            <div className={style['hero-signals']}>
              <span>Live-first sorting</span>
              <span>Mobile swipe mindset</span>
              <span>Fast-reply profiles</span>
            </div>
          </div>
          <div className={style['hero-metrics']}>
            <div>
              <small>Visible creators</small>
              <strong>{total || 'Live loading'}</strong>
            </div>
            <div>
              <small>Sort mode</small>
              <strong>{String(filter?.sortBy || 'live')}</strong>
            </div>
          </div>
        </div>
        <PageHeading title="Creators" icon={<ModelIcon />} />
        <PerformerAdvancedFilter onSubmit={handleFilter} />
        <div className={style['results-bar']}>
          <span>{total ? `${total} creators in rotation` : 'Curating the strongest profiles for you now'}</span>
        </div>
        <Row>
          {performers && performers.length > 0 && performers.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <PerformerGridCard performer={p} />
            </Col>
          ))}
        </Row>
        {!total && !fetching && <p className="text-center" style={{ margin: 20 }}>No profile was found</p>}
        {fetching && (
          <div className="text-center" style={{ margin: 30 }}>
            <Spin />
          </div>
        )}
        <div className="text-center" style={{ margin: '20px 0' }}>
          {total > 0 && total > limit && (
            <StyleProvider hashPriority="high">
              <Pagination
                current={offset + 1}
                total={total}
                pageSize={limit}
                onChange={pageChanged}
              />
            </StyleProvider>
          )}
        </div>
      </div>
    </>
  );
}

Performers.authenticate = true;
Performers.noredirect = true;

export default Performers;
