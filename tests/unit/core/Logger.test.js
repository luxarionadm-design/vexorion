import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLogger, createLogger } from '../../../src/core/Logger.js';

describe('useLogger', () => {
  let logger;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
      time: vi.spyOn(console, 'time').mockImplementation(() => {}),
      timeEnd: vi.spyOn(console, 'timeEnd').mockImplementation(() => {}),
      table: vi.spyOn(console, 'table').mockImplementation(() => {}),
      clear: vi.spyOn(console, 'clear').mockImplementation(() => {})
    };
    logger = new useLogger({ prefix: 'TEST', level: 'info' });
  });

  it('should log debug', () => {
    logger.debug('test');
    expect(consoleSpy.debug).not.toHaveBeenCalled(); // level info > debug
  });

  it('should log info', () => {
    logger.info('test');
    expect(consoleSpy.info).toHaveBeenCalled();
  });

  it('should log warn', () => {
    logger.warn('test');
    expect(consoleSpy.warn).toHaveBeenCalled();
  });

  it('should log error', () => {
    logger.error('test');
    expect(consoleSpy.error).toHaveBeenCalled();
  });

  it('should set level', () => {
    logger.setLevel('debug');
    logger.debug('test');
    expect(consoleSpy.debug).toHaveBeenCalled();
  });

  it('should disable logging', () => {
    logger.setEnabled(false);
    logger.info('test');
    expect(consoleSpy.info).not.toHaveBeenCalled();
  });

  it('should set prefix', () => {
    logger.setPrefix('NEW');
    logger.info('test');
    expect(consoleSpy.info).toHaveBeenCalledWith(expect.stringContaining('NEW'));
  });

  it('should use group', () => {
    logger.group('Group');
    expect(consoleSpy.group).toHaveBeenCalledWith('Group');
    logger.groupEnd();
    expect(consoleSpy.groupEnd).toHaveBeenCalled();
  });

  it('should use time', () => {
    logger.time('Timer');
    expect(consoleSpy.time).toHaveBeenCalledWith('Timer');
    logger.timeEnd('Timer');
    expect(consoleSpy.timeEnd).toHaveBeenCalledWith('Timer');
  });

  it('should use table', () => {
    const data = [{ name: 'John' }];
    logger.table(data);
    expect(consoleSpy.table).toHaveBeenCalledWith(data);
  });

  it('should clear console', () => {
    logger.clear();
    expect(consoleSpy.clear).toHaveBeenCalled();
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    logger.subscribe(subscriber);
    logger.info('test');
    expect(subscriber).toHaveBeenCalled();
  });

  it('should create with helper', () => {
    const instance = createLogger();
    expect(instance).toBeInstanceOf(useLogger);
  });
});
