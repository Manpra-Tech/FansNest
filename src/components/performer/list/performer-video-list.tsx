import { UploadOutlined } from '@ant-design/icons';
import { SearchFilter } from '@components/common/search-filter';
import { TableListVideo } from '@components/video/table-list';
import { showError } from '@lib/utils';
import { videoService } from '@services/video.service';
import {
  Button, Col, Row
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

function PerformerVideosList() {
  const [list, setList] = useState([] as any);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    current: 1,
    total: 0
  });
  const [limit] = useState(10);
  const [sort, setSort] = useState('desc');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filter, setFilter] = useState({});

  const search = async () => {
    try {
      setSearching(true);
      const resp = await videoService.search({
        ...filter,
        limit,
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
    setSortBy(sorter.field || '');
    // eslint-disable-next-line no-nested-ternary
    setSort(sorter.order ? (sorter.order === 'descend' ? 'desc' : 'asc') : '');
  };

  const handleFilter = (values) => {
    setFilter({ ...filter, ...values });
  };

  const deleteVideo = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }
    try {
      await videoService.delete(id);
      search();
    } catch (e) {
      showError(e);
    }
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
          <Col md={16} xs={24} style={{ padding: '0' }}>
            <SearchFilter
              searchWithKeyword
              statuses={statuses}
              onSubmit={handleFilter}
            />
          </Col>
          <Col
            md={8}
            xs={24}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
            }}
          >
            <Button className="primary">
              <Link href="/creator/my-video/upload">
                <UploadOutlined />
                {' '}
                Upload new
              </Link>
            </Button>
            &nbsp;
            <Button className="secondary">
              <Link href="/creator/my-video/bulk-upload">
                <UploadOutlined />
                {' '}
                Bulk upload
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListVideo
          dataSource={list}
          rowKey="_id"
          loading={searching}
          pagination={{
            ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
          }}
          onChange={handleTableChange}
          onDelete={deleteVideo}
        />
      </div>
    </>
  );
}

export default PerformerVideosList;
