import { APIRequest } from './api-request';

export class EarningService extends APIRequest {
  performerStarts(param?: any) {
    return this.get(this.buildUrl('/performer/earning/stats', param));
  }

  performerSearch(param?: any) {
    return this.get(this.buildUrl('/performer/earning/search', param));
  }
}

export const earningService = new EarningService();
