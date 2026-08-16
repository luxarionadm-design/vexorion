// src/core/Cookie.js
export class useCookie {
  constructor(config = {}) {
    this.defaultPath = config.path || '/';
    this.defaultDomain = config.domain || '';
    this.defaultSecure = config.secure || false;
    this.defaultSameSite = config.sameSite || 'lax';
  }

  set(key, value, options = {}) {
    const { days = 7, path = this.defaultPath, domain = this.defaultDomain, secure = this.defaultSecure, sameSite = this.defaultSameSite } = options;
    let cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    if (days) { const date = new Date(); date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); cookie += `; expires=${date.toUTCString()}`; }
    if (path) cookie += `; path=${path}`;
    if (domain) cookie += `; domain=${domain}`;
    if (secure) cookie += `; secure`;
    if (sameSite) cookie += `; samesite=${sameSite}`;
    if (typeof document !== 'undefined') {
      document.cookie = cookie;
    }
    return true;
  }

  get(key) {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const cookie = cookies.find(c => c.startsWith(`${encodeURIComponent(key)}=`));
    if (cookie) return decodeURIComponent(cookie.split('=')[1]);
    return null;
  }

  getAll() {
    if (typeof document === 'undefined' || !document.cookie) return {};
    const cookies = document.cookie.split('; ');
    const result = {};
    cookies.forEach(cookie => {
      if (!cookie) return;
      const parts = cookie.split('=');
      const key = decodeURIComponent(parts[0]);
      const value = decodeURIComponent(parts.slice(1).join('='));
      result[key] = value;
    });
    return result;
  }

  remove(key, options = {}) {
    if (typeof document === 'undefined') return false;
    const { path = this.defaultPath, domain = this.defaultDomain } = options;
    document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
    return true;
  }

  has(key) { return this.get(key) !== null; }
  clear() {
    if (typeof document === 'undefined' || !document.cookie) return true;
    const cookies = document.cookie.split('; ');
    cookies.forEach(cookie => {
      if (!cookie) return;
      const [key] = cookie.split('=');
      this.remove(decodeURIComponent(key));
    });
    return true;
  }
}
