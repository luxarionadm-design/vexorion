import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useToken, createToken } from '../../../src/core/Token.js';

describe('useToken', () => {
  let token;

  beforeEach(() => {
    token = new useToken();
    crypto.subtle.importKey = vi.fn().mockResolvedValue({});
    crypto.subtle.sign = vi.fn().mockResolvedValue(new ArrayBuffer(32));
  });

  it('should generate token', () => {
    const result = token.generate(16);
    expect(result).toBeDefined();
    expect(result.length).toBe(32);
  });

  it('should generate numeric token', () => {
    const result = token.generateNumeric(6);
    expect(result).toBeDefined();
    expect(result.length).toBe(6);
    expect(/^\d+$/.test(result)).toBe(true);
  });

  it('should generate alphanumeric token', () => {
    const result = token.generateAlphaNumeric(8);
    expect(result).toBeDefined();
    expect(result.length).toBe(8);
  });

  it('should generate JWT', () => {
    const jwt = token.generateJWT({ userId: 1 }, 'secret');
    expect(jwt).toBeDefined();
    expect(jwt.split('.')).toHaveLength(3);
  });

  it('should generate OTP', () => {
    const otp = token.generateOTP(6, 300);
    expect(otp.code).toBeDefined();
    expect(otp.code.length).toBe(6);
    expect(otp.expiresAt).toBeDefined();
  });

  it('should verify OTP', () => {
    const otp = token.generateOTP(6, 300);
    const result = token.verifyOTP(otp.code, otp.code, otp.expiresAt);
    expect(result).toBe(true);
  });

  it('should reject expired OTP', () => {
    const otp = token.generateOTP(6, 300);
    vi.useFakeTimers();
    vi.advanceTimersByTime(400000);
    const result = token.verifyOTP(otp.code, otp.code, otp.expiresAt);
    expect(result).toBe(false);
    vi.useRealTimers();
  });

  it('should reject invalid OTP', () => {
    const otp = token.generateOTP(6, 300);
    const result = token.verifyOTP('123456', otp.code, otp.expiresAt);
    expect(result).toBe(false);
  });

  it('should create with helper', () => {
    const instance = createToken();
    expect(instance).toBeInstanceOf(useToken);
  });
});
