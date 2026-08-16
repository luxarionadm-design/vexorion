import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFileUpload, createFileUpload } from '../../../src/core/FileUpload.js';

describe('useFileUpload', () => {
  let fileUpload;

  beforeEach(() => {
    fileUpload = new useFileUpload({
      maxSize: 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/png'],
      maxFiles: 2
    });
  });

  it('should add files', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileList = [file];
    const count = fileUpload.addFiles(fileList);
    expect(count).toBe(1);
    expect(fileUpload.getFiles()).toHaveLength(1);
  });

  it('should reject oversized file', () => {
    const file = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const count = fileUpload.addFiles([file]);
    expect(count).toBe(0);
    expect(fileUpload.getErrors()).toHaveLength(1);
  });

  it('should reject invalid file type', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const count = fileUpload.addFiles([file]);
    expect(count).toBe(0);
    expect(fileUpload.getErrors()).toHaveLength(1);
  });

  it('should respect maxFiles', () => {
    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
    const file3 = new File(['test3'], 'test3.jpg', { type: 'image/jpeg' });
    
    fileUpload.addFiles([file1]);
    fileUpload.addFiles([file2]);
    fileUpload.addFiles([file3]);
    
    expect(fileUpload.getFiles()).toHaveLength(2);
  });

  it('should remove file', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fileUpload.addFiles([file]);
    expect(fileUpload.getFiles()).toHaveLength(1);
    
    fileUpload.removeFile(0);
    expect(fileUpload.getFiles()).toHaveLength(0);
  });

  it('should clear files', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fileUpload.addFiles([file]);
    fileUpload.clearFiles();
    expect(fileUpload.getFiles()).toHaveLength(0);
  });

  it('should get progress', () => {
    expect(fileUpload.getProgress()).toBe(0);
  });

  it('should check uploading state', () => {
    expect(fileUpload.isUploading()).toBe(false);
  });

  it('should get stats', () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fileUpload.addFiles([file]);
    
    const stats = fileUpload.getStats();
    expect(stats.total).toBe(1);
    expect(stats.uploaded).toBe(0);
    expect(stats.failed).toBe(0);
    expect(stats.pending).toBe(1);
  });

  it('should notify subscribers', () => {
    const subscriber = vi.fn();
    fileUpload.subscribe(subscriber);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fileUpload.addFiles([file]);
    
    expect(subscriber).toHaveBeenCalled();
  });

  it('should create with helper', () => {
    const instance = createFileUpload();
    expect(instance).toBeInstanceOf(useFileUpload);
  });
});
