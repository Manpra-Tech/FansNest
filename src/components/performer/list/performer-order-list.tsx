import { OrderSearchFilter } from '@components/order';
import OrderTableList from '@components/order/table-list';
import { showError } from '@lib/utils';
import { orderService } from '@services/index';
import { useEffect, useState } from 'react';
import { ConnectedProps, connect } from 'react-redux';

const mapStatesToProps = (state: any) => ({
  user: state.user.current
});

const connector = connect(mapStatesToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

function PerformerOrderList({ user }: PropsFromRedux) {
  const limit = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: limit
  });
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({}) as any;
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');

  const search = async () => {
    try {
      setSearching(true);
      const resp = await orderService.performerSearch({
        ...filter,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * limit,
        sort,
        sortBy
      });
      setList(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total,
        pageSize: limit
      });
    } catch (e) {
      showError(e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filter), JSON.stringify(pagination), sort, sortBy]);

  const handleTableChange = (pag, filters, sorter) => {
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

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  return (
    <>
      <OrderSearchFilter
        onSubmit={handleFilter}
      />
      <OrderTableList
        user={user}
        dataSource={list}
        rowKey="_id"
        loading={searching}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </>
  );
}

export default connector(PerformerOrderList);
