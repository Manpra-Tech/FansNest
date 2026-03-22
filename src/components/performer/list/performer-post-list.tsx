import { SearchFilter } from '@components/common/search-filter';
import FeedList from '@components/post/list/table-list';
import { showError } from '@lib/utils';
import { feedService } from '@services/index';
import {
  message
} from 'antd';
import { useEffect, useState } from 'react';

function PerformerPostListing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');

  const getData = async () => {
    try {
      setLoading(true);
      const resp = await feedService.search({
        ...filter,
        sort,
        sortBy,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize
      });
      setItems(resp.data.data);
      setPagination({ ...pagination, total: resp.data.total });
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
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

  const deleteFeed = async (feed) => {
    if (!window.confirm('All earnings related to this post will be refunded. Are you sure to remove it?')) {
      return;
    }
    try {
      await feedService.delete(feed._id);
      message.success('Post deleted successfully');
      getData();
    } catch (e) {
      showError(e);
    }
  };

  const type = [
    {
      key: '',
      text: 'All types'
    },
    {
      key: 'text',
      text: 'Text'
    },
    {
      key: 'video',
      text: 'Video'
    },
    {
      key: 'photo',
      text: 'Photo'
    },
    {
      key: 'scheduled-streaming',
      text: 'Scheduled Streaming'
    }
  ];
  return (
    <>
      <SearchFilter
        onSubmit={handleFilter}
        type={type}
        searchWithKeyword
        dateRange
      />
      <FeedList
        feeds={items}
        total={pagination.total}
        pageSize={pagination.pageSize}
        searching={loading}
        onChange={handleTableChange}
        onDelete={deleteFeed}
      />
    </>
  );
}

export default PerformerPostListing;
