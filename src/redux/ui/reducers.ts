import { createReducers } from '@lib/redux';
import { merge } from 'lodash';

import { loadUIValue, updateUIValue } from './actions';

const initialState = {
  siteName: 'FansNest',
  logo: '/logo.svg',
  darkmodeLogo: '/logo-dark.svg',
  menus: [],
  favicon: '/favicon.ico'
};

const uiReducers = [
  {
    on: updateUIValue,
    reducer(state: any, data: any) {
      if (typeof window !== 'undefined') {
        Object.keys(data.payload).forEach(
          (key) => localStorage && localStorage.setItem(key, data.payload[key])
        );
      }
      return {
        ...state,
        ...data.payload
      };
    }
  },
  {
    on: loadUIValue,
    reducer(state: any) {
      const newVal = {};
      if (typeof window !== 'undefined') {
        Object.keys(initialState).forEach((key) => {
          let val = localStorage.getItem(key);
          if (key === 'logo' && val === '/logo.png') {
            val = '/logo.svg';
          }
          if (key === 'darkmodeLogo' && val === '/logo-dark.png') {
            val = '/logo-dark.svg';
          }
          if (val) {
            newVal[key] = val;
          }
        });
      }
      return {
        ...state,
        ...newVal
      };
    }
  }
];

export default merge({}, createReducers('ui', [uiReducers], initialState));
