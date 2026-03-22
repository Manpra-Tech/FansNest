import { SearchFilter } from '@components/common';
import { PlusOutlined } from '@ant-design/icons';
import { galleryService } from '@services/gallery.service';
import {
  Button, Col, message, Row
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { TableListGallery } from '@components/gallery/table-list';
import { showError } from '@lib/utils';
import { isMobile } from 'react-device-detect';

function PerformerGalleriesList() {
  const [galleries, setGalleries] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState('desc');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const search = async () => {
    try {
      const resp = await galleryService.search({
        ...filters,
        limit: pagination.pageSize,
        offset: (pagination.current - 1) * pagination.pageSize,
        sort,
        sortBy
      });
      setGalleries(resp.data.data);
      setPagination({
        ...pagination,
        total: resp.data.total
      });
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [JSON.stringify(filters), JSON.stringify(pagination), sort, sortBy]);

  const handleSorterChange = async (pag, filter, sorter) => {
    setPagination({
      ...pagination,
      current: pag.current
    });
    setSortBy(sorter.field || 'createdAt');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '');
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery?')) return;
    try {
      await galleryService.delete(id);
      message.success('Your gallery was deleted successfully');
      search();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
  };

  const handleFilter = (params) => {
    setFilters({ ...filters, ...params });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const statuses = [
    {
      key: '',
      text: 'Status'
    },
    {
      key: 'active',
      text: 'Active'
    },
    {
      key: 'inactive',
      text: 'Inactive'
    }
  ];
  return (
    <>
      <div>
        <Row style={{ margin: '0 0 10px 0' }}>
          <Col lg={20} xs={24} style={{ padding: '0' }}>
            <SearchFilter statuses={statuses} searchWithKeyword onSubmit={handleFilter} />
          </Col>
          <Col
            lg={4}
            xs={24}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
            }}
          >
            <Link href="/creator/my-gallery/create">
              <Button className="secondary">
                <PlusOutlined />
                {' '}
                Create New
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListGallery
          dataSource={galleries}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
          }}
          onChange={handleSorterChange}
          deleteGallery={handleDeleteGallery}
        />
      </div>
    </>
  );
}

export default PerformerGalleriesList;
