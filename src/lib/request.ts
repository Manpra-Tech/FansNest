import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import {
  useEffect, useState
} from 'react';

const omit = require('lodash/omit');

export type SearchRequest = {
  query: Partial<FilterQuery>;
  page: number;
  limit: number;
  setFieldValue: (key: string, value: any) => void;
  setFieldsValue: (filterQuery: Record<string, any>) => void;
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => void;
};

export type FilterQuery = {
  sort?: string;
  sortBy?: string;
  [K: string]: any;
};

export function useSearch(pageSize = 10, options = {}): SearchRequest {
  const [limit] = useState(pageSize);
  const [filters, setFilters] = useState<FilterQuery>({
    page: 1,
    ...options
  });

  const setFieldValue = (key: string, value: any) => {
    setFilters((state) => ({ ...state, [key]: value }));
  };

  const setFieldsValue = (filterQuery: Record<string, string>) => {
    setFilters((state) => ({ ...state, ...filterQuery }));
  };

  const onChange = (
    pagination: TablePaginationConfig,
    filter: Record<string, FilterValue | null>,
    sorter: any
  ) => {
    setFilters((state) => ({
      ...state,
      ...filter,
      page: pagination.current as number,
      sortBy: sorter.field || filters.sortBy || 'createdAt',
      // eslint-disable-next-line no-nested-ternary
      sort: (sorter.order && (sorter.order === 'descend' ? 'DESC' : 'ASC')) || filters.sort || 'DESC'
    }));
  };

  return {
    query: omit(filters, 'page'),
    page: filters.page,
    limit,
    setFieldValue,
    setFieldsValue,
    onChange
  };
}

export const usePagination = ({ pageSize, current }: Partial<TablePaginationConfig>): [
  TablePaginationConfig,
  (pagination: Partial<TablePaginationConfig>) => void
] => {
  const [pagination, setState] = useState<TablePaginationConfig>({
    showSizeChanger: false,
    pageSize,
    current
  });

  const setPagination = (data: Partial<TablePaginationConfig>) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    setPagination({ pageSize });
  }, [pageSize]);

  useEffect(() => {
    setPagination({ current });
  }, [current]);

  return [pagination, setPagination];
};
