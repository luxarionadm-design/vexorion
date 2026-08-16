import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFileReader, createFileReader } from '../../../src/core/FileReader.js';

describe('useFileReader', () => {
  let fileReader;

  beforeEach(() => {
    fileReader = new useFileReader();
  });

  it('should read as text', async () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const result = await fileReader.readAsText(file);
    expect(result).toBeDefined();
  });

  it('should read as data URL', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await fileReader.readAsDataURL(file);
    expect(result).toBeDefined();
  });

  it('should read as array buffer', async () => {
    const file = new File(['test'], 'test.bin');
    const result = await fileReader.readAsArrayBuffer(file);
    expect(result).toBeDefined();
  });

  it('should read as binary string', async () => {
    const file = new File(['test'], 'test.bin');
    const result = await fileReader.readAsBinaryString(file);
    expect(result).toBeDefined();
  });

  it('should abort reading', () => {
    const spy = vi.spyOn(FileReader.prototype, 'abort');
    fileReader.abort();
    expect(spy).toHaveBeenCalled();
  });

  it('should get result', () => {
    expect(fileReader.getResult()).toBeNull();
  });

  it('should get error', () => {
    expect(fileReader.getError()).toBeNull();
  });

  it('should check loading state', () => {
    expect(fileReader.isLoading()).toBe(false);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    fileReader.subscribe(subscriber);
    
    const file = new File(['test'], 'test.txt');
    fileReader.readAsText(file);
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should destroy', () => {
    fileReader.destroy();
    expect(fileReader._listeners.size).toBe(0);
  });

  it('should create with helper', () => {
    const instance = createFileReader();
    expect(instance).toBeInstanceOf(useFileReader);
  });
});
