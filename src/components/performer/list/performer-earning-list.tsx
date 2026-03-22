import { TableListEarning } from '@components/earning/table-earning';
import { showError } from '@lib/utils';
import {
  Statistic
} from 'antd';
import { useEffect, useState } from 'react';
import { SearchFilter } from 'src/components/common/search-filter';
import {
  IEarning, IPerformerStats
} from 'src/interfaces';
import { earningService } from 'src/services';

import { isMobile } from 'react-device-detect';
import style from './performer-earning-list.module.scss';

function PerformerEarningList() {
  const [loading, setLoading] = useState(false);
  const [earning, setEarning] = useState<IEarning[]>();
  const [pagination, setPagination] = useState({ total: 0, current: 1, pageSize: 10 });
  const [stats, setStats] = useState<IPerformerStats>();
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sort, setSort] = useState('desc');
  const [type, setType] = useState('');
  const [dateRange, setDateRange] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      const { current, pageSize } = pagination;
      const resp = await earningService.performerSearch({
        limit: pageSize,
        offset: (current - 1) * pageSize,
        sort,
        sortBy,
        type,
        ...dateRange
      });
      setEarning(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const getPerformerStats = async () => {
    const resp = await earningService.performerStarts({
      type,
      ...dateRange
    });
    resp.data && setStats(resp.data);
  };

  useEffect(() => {
    setPagination({ ...pagination, current: 1 });
    getPerformerStats();
  }, [type, dateRange]);

  useEffect(() => {
    getData();
  }, [JSON.stringify(pagination), sort, sortBy, type, dateRange]);

  const handleFilter = async (data) => {
    setType(data.type);
    setDateRange({
      ...dateRange,
      fromDate: data.fromDate,
      toDate: data.toDate
    });
  };

  const handleTabsChange = async (pag, filters, sorter) => {
    setPagination({ ...pagination, current: pag.current });
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  return (
    <>
      <SearchFilter
        type={[
          { key: '', text: 'All types' },
          { key: 'product', text: 'Product' },
          { key: 'gallery', text: 'Gallery' },
          { key: 'feed', text: 'Post' },
          { key: 'video', text: 'Video' },
          { key: 'tip', text: 'Tip' },
          { key: 'stream_tip', text: 'Streaming tip' },
          { key: 'public_chat', text: 'Paid steaming' },
          { key: 'monthly_subscription', text: 'Monthly Subscription' },
          { key: 'yearly_subscription', text: 'Yearly Subscription' }
        ]}
        onSubmit={handleFilter}
        dateRange
      />
      <div className={style['stats-earning']}>
        <Statistic
          title="Total"
          prefix="$"
          value={stats?.totalGrossPrice || 0}
          precision={2}
        />
        <Statistic
          title="Platform commission"
          prefix="$"
          value={stats?.totalSiteCommission || 0}
          precision={2}
        />
        <Statistic
          title="Your Earnings"
          prefix="$"
          value={stats?.totalNetPrice || 0}
          precision={2}
        />
      </div>
      <div className="table-responsive">
        <TableListEarning
          dataSource={earning}
          rowKey="_id"
          pagination={{
            ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
          }}
          loading={loading}
          onChange={handleTabsChange}
        />
      </div>
    </>
  );
}

export default PerformerEarningList;
