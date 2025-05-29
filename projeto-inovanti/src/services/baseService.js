import axios from 'axios';

export class BaseService {
  constructor(baseURL) {
    this.api = axios.create({ baseURL });
  }

  create(endpoint, data) {
    return this.api.post(endpoint, data);
  }

  get(endpoint, params) {
    return this.api.get(endpoint, { params });
  }

  update(endpoint, data) {
    return this.api.put(endpoint, data);
  }

  delete(endpoint) {
    return this.api.delete(endpoint);
  }
}