import { showError } from '@lib/utils';
import { payoutRequestService } from '@services/index';
import { Button } from 'antd';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import PayoutRequestList from 'src/components/payout-request/table';

function PerformerPayoutRequestList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await payoutRequestService.search({
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setItems(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
    const pager = { ...pagination };
    pager.current = pag.current;
    setPagination(pager);
    setSortBy(sorter.field || 'updatedAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : 'desc');
  };

  return (
    <>
      <div style={{ margin: '10px 0' }}>
        <Button
          type="primary"
          onClick={() => Router.push('/creator/payout-request/create')}
        >
          Request a Payout
        </Button>
      </div>
      <div className="table-responsive">
        <PayoutRequestList
          payouts={items}
          searching={loading}
          total={pagination.total}
          onChange={handleTableChange}
          pageSize={pagination.pageSize}
        />
      </div>
    </>
  );
}

export default PerformerPayoutRequestList;
