// src/core/Token.js
export class useToken {
  constructor() {
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
  }

  generate(length = 32) {
    const bytes = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  generateNumeric(length = 6) {
    let token = '';
    for (let i = 0; i < length; i++) {
      token += Math.floor(Math.random() * 10);
    }
    return token;
  }

  generateAlphaNumeric(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  async generateJWT(payload, secret, expiresIn = 3600) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payloadWithExp = { ...payload, exp: now + expiresIn, iat: now };
    const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '');
    const encodedPayload = btoa(JSON.stringify(payloadWithExp)).replace(/=+$/, '');
    const signature = await this._sign(`${encodedHeader}.${encodedPayload}`, secret);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async _sign(data, secret) {
    const key = this.encoder.encode(secret);
    const dataEncoded = this.encoder.encode(data);
    const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataEncoded);
    return btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async verifyJWT(token, secret) {
    try {
      const [encodedHeader, encodedPayload, signature] = token.split('.');
      const expectedSignature = await this._sign(`${encodedHeader}.${encodedPayload}`, secret);
      if (signature !== expectedSignature) return null;
      const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.exp && Date.now() / 1000 > payload.exp) return null;
      return payload;
    } catch { return null; }
  }

  generateOTP(length = 6, expiresIn = 300) {
    const code = this.generateNumeric(length);
    return { code, expiresAt: Date.now() + expiresIn * 1000 };
  }

  verifyOTP(otp, code, expiresAt) {
    if (Date.now() > expiresAt) return false;
    return otp === code;
  }
}

export function createToken() {
  return new useToken();
}
