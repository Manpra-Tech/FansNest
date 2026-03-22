import { SearchFilter } from '@components/common/search-filter';
import { PerformerTableListSubscription } from '@components/subscription/performer-table-list-subscription';
import { showError } from '@lib/utils';
import { subscriptionService } from '@services/subscription.service';
import { useEffect, useState } from 'react';
import { ISubscription } from 'src/interfaces';

function PerformerSubscriberList() {
  const [subscriptionList, setSubscriptionList] = useState<ISubscription[]>();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filter, setFilter] = useState({});

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await subscriptionService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setSubscriptionList(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const handleTabChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order
      ? sorter.order === 'descend'
        ? 'desc'
        : 'asc'
      : 'desc');
  };

  const statuses = [
    {
      key: '',
      text: 'All Statuses'
    },
    {
      key: 'active',
      text: 'Active'
    },
    {
      key: 'deactivated',
      text: 'Inactive'
    },
    {
      key: 'suspended',
      text: 'Suspended'
    }
  ];
  const types = [
    {
      key: '',
      text: 'All Types'
    },
    {
      key: 'free',
      text: 'Free Subscription'
    },
    {
      key: 'monthly',
      text: 'Monthly Subscription'
    },
    {
      key: 'yearly',
      text: 'Yearly Subscription'
    }
  ];
  return (
    <>
      <SearchFilter
        subscriptionTypes={types}
        statuses={statuses}
        dateRange
        onSubmit={handleFilter}
      />
      <div className="table-responsive">
        <PerformerTableListSubscription
          dataSource={subscriptionList}
          pagination={pagination}
          loading={loading}
          onChange={handleTabChange}
          rowKey="_id"
        />
      </div>
    </>
  );
}

export default PerformerSubscriberList;
