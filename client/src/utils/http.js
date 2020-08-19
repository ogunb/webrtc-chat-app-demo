import buildUrl from './urlBuilder';

export default {
  async get(path, options) {
    const response = await fetch(buildUrl(path), { ...options, method: 'GET' });
    return (await response.json());
  },

  async post(path, body, options) {
    const response = await fetch(buildUrl(path), { ...options, method: 'POST', body });
    return (await response.json());
  },

  async put(path, body, options) {
    const response = await fetch(buildUrl(path), { ...options, method: 'PUT', body });
    return (await response.json());
  },

  async delete(path, options) {
    const response = await fetch(buildUrl(path), { ...options, method: 'DELETE' });
    return (await response.json());
  }
}
