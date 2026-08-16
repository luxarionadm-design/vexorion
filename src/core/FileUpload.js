// src/core/FileUpload.js
export class useFileUpload {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 5 * 1024 * 1024;
    this.allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    this.maxFiles = options.maxFiles || 5;
    this.files = [];
    this.errors = [];
    this.uploading = false;
    this.progress = 0;
    this.listeners = new Set();
  }

  _notify() { this.listeners.forEach(cb => { try { cb(this.files, this.errors, this.uploading, this.progress); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  validate(file) {
    const errors = [];
    if (file.size > this.maxSize) {
      errors.push(`File "${file.name}" exceeds maximum size of ${this.maxSize / 1024 / 1024}MB`);
    }
    if (this.allowedTypes.length > 0 && !this.allowedTypes.includes(file.type) && !this.allowedTypes.includes('*/*')) {
      errors.push(`File type "${file.type || 'unknown'}" is not allowed for "${file.name}"`);
    }
    return errors;
  }

  addFiles(fileList) {
    this.errors = [];
    const newFiles = [];
    for (const file of fileList) {
      const errors = this.validate(file);
      if (errors.length > 0) {
        this.errors.push(...errors);
        continue;
      }
      if (this.files.length + newFiles.length >= this.maxFiles) {
        this.errors.push(`Maximum ${this.maxFiles} files allowed`);
        break;
      }
      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        progress: 0,
        status: 'pending',
        url: typeof URL !== 'undefined' ? URL.createObjectURL(file) : '',
      });
    }
    this.files.push(...newFiles);
    this._notify();
    return newFiles.length;
  }

  removeFile(index) {
    if (index >= 0 && index < this.files.length) {
      const removed = this.files.splice(index, 1)[0];
      if (removed.url && typeof URL !== 'undefined') URL.revokeObjectURL(removed.url);
      this._notify();
      return removed;
    }
    return null;
  }

  clearFiles() {
    for (const file of this.files) {
      if (file.url && typeof URL !== 'undefined') URL.revokeObjectURL(file.url);
    }
    this.files = [];
    this.errors = [];
    this.progress = 0;
    this._notify();
  }

  async upload(url, options = {}) {
    if (this.files.length === 0) return;
    this.uploading = true;
    this.progress = 0;
    this._notify();

    const { method = 'POST', headers = {}, fieldName = 'file', data = {} } = options;

    for (let i = 0; i < this.files.length; i++) {
      const fileItem = this.files[i];
      fileItem.status = 'uploading';
      this._notify();

      const formData = new FormData();
      formData.append(fieldName, fileItem.file);
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      try {
        const xhr = new XMLHttpRequest();
        fileItem.xhr = xhr;

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            fileItem.progress = (e.loaded / e.total) * 100;
            const totalProgress = this.files.reduce((sum, f) => sum + f.progress, 0) / this.files.length;
            this.progress = totalProgress;
            this._notify();
          }
        });

        await new Promise((resolve, reject) => {
          xhr.open(method, url);
          for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
          }
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              fileItem.status = 'success';
              fileItem.response = xhr.responseText;
              resolve(xhr.response);
            } else {
              fileItem.status = 'error';
              fileItem.error = xhr.statusText;
              reject(new Error(xhr.statusText));
            }
          };
          xhr.onerror = () => {
            fileItem.status = 'error';
            fileItem.error = 'Network error';
            reject(new Error('Network error'));
          };
          xhr.send(formData);
        });
      } catch (error) {
        fileItem.status = 'error';
        fileItem.error = error.message;
        this.errors.push(`Upload failed for "${fileItem.name}": ${error.message}`);
      } finally {
        this._notify();
      }
    }

    this.uploading = false;
    this._notify();
  }

  cancelUpload(index) {
    if (index >= 0 && index < this.files.length) {
      const fileItem = this.files[index];
      if (fileItem.xhr && fileItem.status === 'uploading') {
        fileItem.xhr.abort();
        fileItem.status = 'cancelled';
        this._notify();
      }
    }
  }

  getFiles() { return this.files; }
  getErrors() { return this.errors; }
  getProgress() { return this.progress; }
  isUploading() { return this.uploading; }
  getStats() {
    const total = this.files.length;
    const uploaded = this.files.filter(f => f.status === 'success').length;
    const failed = this.files.filter(f => f.status === 'error').length;
    const pending = this.files.filter(f => f.status === 'pending').length;
    const totalSize = this.files.reduce((sum, f) => sum + f.size, 0);
    return { total, uploaded, failed, pending, totalSize };
  }

  destroy() {
    this.clearFiles();
    this.listeners.clear();
  }
}

export function createFileUpload(options = {}) {
  return new useFileUpload(options);
}
