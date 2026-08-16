// src/core/Queue.js
export class useQueue {
  constructor(options = {}) {
    this.queue = [];
    this.maxSize = options.maxSize || 0;
    this.processing = false;
    this.concurrent = options.concurrent || 1;
    this.activeCount = 0;
    this.listeners = new Set();
  }

  _notify() { this.listeners.forEach(cb => { try { cb(this.queue.length, this.activeCount); } catch (e) {} }); }

  subscribe(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback); }

  enqueue(task) {
    if (this.maxSize > 0 && this.queue.length >= this.maxSize) {
      throw new Error('Queue is full');
    }
    this.queue.push(task);
    this._notify();
    this._process();
  }

  enqueueMany(tasks) {
    for (const task of tasks) {
      if (this.maxSize > 0 && this.queue.length >= this.maxSize) break;
      this.queue.push(task);
    }
    this._notify();
    this._process();
  }

  dequeue() {
    if (this.queue.length === 0) return null;
    const task = this.queue.shift();
    this._notify();
    return task;
  }

  async _process() {
    if (this.processing) return;
    if (this.queue.length === 0) return;
    if (this.activeCount >= this.concurrent) return;
    this.processing = true;
    while (this.queue.length > 0 && this.activeCount < this.concurrent) {
      const task = this.queue.shift();
      if (!task) break;
      this.activeCount++;
      this._notify();
      try {
        await task();
      } catch (error) {
        console.error('Queue task error:', error);
      } finally {
        this.activeCount--;
        this._notify();
        if (this.queue.length > 0 && this.activeCount < this.concurrent) {
          this._process();
        }
      }
    }
    this.processing = false;
    if (this.queue.length > 0 && this.activeCount < this.concurrent) {
      this._process();
    }
    this._notify();
  }

  clear() { this.queue = []; this._notify(); }
  size() { return this.queue.length; }
  isEmpty() { return this.queue.length === 0; }
  isFull() { return this.maxSize > 0 && this.queue.length >= this.maxSize; }
  getQueue() { return [...this.queue]; }
  setConcurrent(concurrent) { this.concurrent = concurrent; }
}

export function createQueue(options = {}) {
  return new useQueue(options);
}
