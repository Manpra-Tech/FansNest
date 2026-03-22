import { SearchFilter } from '@components/common/search-filter';
import { TableListProduct } from '@components/product/table-list-product';
import { productService } from '@services/product.service';
import {
  Button, Col, message, Row
} from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

function PerformerProductsList() {
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
      const resp = await productService.search({
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
      message.error('An error occurred, please try again!');
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

  const deleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return false;
    }
    try {
      await productService.delete(id);
      message.success('Deleted successfully');
      await search();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return true;
  };

  const statuses = [
    {
      key: '',
      text: 'All'
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
            <SearchFilter
              statuses={statuses}
              onSubmit={handleFilter}
              searchWithKeyword
            />
          </Col>
          <Col
            lg={4}
            xs={24}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0'
            }}
          >
            <Button className="secondary">
              <Link href="/creator/my-store/create">
                New Product
              </Link>
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <TableListProduct
          dataSource={list}
          rowKey="_id"
          loading={searching}
          pagination={{
            ...pagination, position: ['bottomCenter'], showSizeChanger: false, simple: isMobile
          }}
          onChange={handleTableChange}
          deleteProduct={deleteProduct}
        />
      </div>
    </>
  );
}

export default PerformerProductsList;
