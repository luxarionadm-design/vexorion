import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQueue, createQueue } from '../../../src/core/Queue.js';

describe('useQueue', () => {
  let queue;

  beforeEach(() => {
    queue = new useQueue({ concurrent: 2 });
  });

  it('should enqueue and process tasks', async () => {
    const task = vi.fn().mockResolvedValue('result');
    queue.enqueue(task);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(task).toHaveBeenCalled();
  });

  it('should enqueue multiple tasks', () => {
    const task1 = () => {};
    const task2 = () => {};
    queue.enqueueMany([task1, task2]);
    expect(queue.size()).toBe(2);
  });

  it('should dequeue tasks', () => {
    const task = () => {};
    queue.enqueue(task);
    const dequeued = queue.dequeue();
    expect(dequeued).toBe(task);
    expect(queue.isEmpty()).toBe(true);
  });

  it('should clear queue', () => {
    queue.enqueue(() => {});
    queue.enqueue(() => {});
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
  });

  it('should limit concurrent tasks', async () => {
    let running = 0;
    let maxRunning = 0;
    const tasks = [];

    for (let i = 0; i < 5; i++) {
      tasks.push(async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise(resolve => setTimeout(resolve, 50));
        running--;
      });
    }

    queue.setConcurrent(2);
    queue.enqueueMany(tasks);
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(maxRunning).toBe(2);
  });

  it('should throw when queue is full', () => {
    const maxQueue = new useQueue({ maxSize: 2 });
    maxQueue.enqueue(() => {});
    maxQueue.enqueue(() => {});
    expect(() => maxQueue.enqueue(() => {})).toThrow('Queue is full');
  });

  it('should handle task errors gracefully', async () => {
    const errorTask = vi.fn().mockRejectedValue(new Error('Task failed'));
    const successTask = vi.fn().mockResolvedValue('success');
    
    queue.enqueue(errorTask);
    queue.enqueue(successTask);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(successTask).toHaveBeenCalled();
  });

  it('should notify subscribers', () => {
    const callback = vi.fn();
    queue.subscribe(callback);
    queue.enqueue(() => {});
    expect(callback).toHaveBeenCalled();
  });

  it('should check if empty', () => {
    expect(queue.isEmpty()).toBe(true);
    queue.enqueue(() => {});
    expect(queue.isEmpty()).toBe(false);
  });

  it('should check if full', () => {
    const maxQueue = new useQueue({ maxSize: 2 });
    expect(maxQueue.isFull()).toBe(false);
    maxQueue.enqueue(() => {});
    maxQueue.enqueue(() => {});
    expect(maxQueue.isFull()).toBe(true);
  });

  it('should get queue', () => {
    const task1 = () => {};
    const task2 = () => {};
    queue.enqueue(task1);
    queue.enqueue(task2);
    expect(queue.getQueue()).toEqual([task1, task2]);
  });

  it('should create with helper', () => {
    const instance = createQueue();
    expect(instance).toBeInstanceOf(useQueue);
  });
});
