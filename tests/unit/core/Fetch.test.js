import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFetch } from '../../../src/core/Fetch.js';

describe('useFetch', () => {
  let fetchInstance;

  beforeEach(() => {
    fetchInstance = new useFetch({ baseURL: 'https://api.example.com' });
    global.fetch.mockClear();
  });

  it('should create instance with default config', () => {
    const instance = new useFetch();
    expect(instance.baseURL).toBe('');
    expect(instance.timeout).toBe(30000);
    expect(instance.cacheTTL).toBe(60000);
  });

  it('should create instance with custom config', () => {
    const instance = new useFetch({ baseURL: 'https://test.com', timeout: 5000, cacheTTL: 30000 });
    expect(instance.baseURL).toBe('https://test.com');
    expect(instance.timeout).toBe(5000);
    expect(instance.cacheTTL).toBe(30000);
  });

  it('should make GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue(mockData)
    });

    const result = await fetchInstance.get('/users');
    expect(result.data).toEqual(mockData);
    expect(result.status).toBe(200);
    expect(result.ok).toBe(true);
  });

  it('should handle HTTP error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: vi.fn().mockResolvedValue({ error: 'Not found' })
    });

    await expect(fetchInstance.get('/users/999')).rejects.toThrow('HTTP 404: Not Found');
  });

  it('should handle timeout', async () => {
    const instance = new useFetch({ timeout: 100 });
    global.fetch.mockImplementation(() => new Promise(() => {}));

    await expect(instance.get('/slow')).rejects.toThrow('Request timeout');
  });

  it('should cache GET requests', async () => {
    const mockData = { data: 'cached' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue(mockData)
    });

    await fetchInstance.get('/cached');
    await fetchInstance.get('/cached');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should invalidate cache', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ data: 'test' })
    });

    await fetchInstance.get('/users/1');
    fetchInstance.invalidateCache('/users');
    await fetchInstance.get('/users/1');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should clear cache', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ data: 'test' })
    });

    await fetchInstance.get('/test');
    fetchInstance.clearCache();
    await fetchInstance.get('/test');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should make POST request', async () => {
    const data = { name: 'John' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ id: 1 })
    });

    await fetchInstance.post('/users', data);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(data) })
    );
  });

  it('should make PUT request', async () => {
    const data = { name: 'John' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({})
    });

    await fetchInstance.put('/users/1', data);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(data) })
    );
  });

  it('should make DELETE request', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({})
    });

    await fetchInstance.delete('/users/1');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should make PATCH request', async () => {
    const data = { name: 'John' };
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({})
    });

    await fetchInstance.patch('/users/1', data);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.example.com/users/1',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify(data) })
    );
  });

  it('should use request interceptor', async () => {
    const interceptor = vi.fn((config) => ({ ...config, headers: { ...config.headers, 'X-Test': 'test' } }));
    fetchInstance.addRequestInterceptor(interceptor);

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({})
    });

    await fetchInstance.get('/test');
    expect(interceptor).toHaveBeenCalled();
  });

  it('should use response interceptor', async () => {
    const interceptor = vi.fn((data) => ({ ...data, modified: true }));
    fetchInstance.addResponseInterceptor(interceptor);

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ data: 'test' })
    });

    await fetchInstance.get('/test');
    expect(interceptor).toHaveBeenCalled();
  });

  it('should use error interceptor', async () => {
    const interceptor = vi.fn();
    fetchInstance.addErrorInterceptor(interceptor);

    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error',
      json: vi.fn().mockResolvedValue({})
    });

    await expect(fetchInstance.get('/error')).rejects.toThrow();
    expect(interceptor).toHaveBeenCalled();
  });

  it('should remove interceptor', () => {
    const interceptor = vi.fn();
    const remove = fetchInstance.addRequestInterceptor(interceptor);
    remove();
    expect(fetchInstance.interceptors.request).not.toContain(interceptor);
  });
});
