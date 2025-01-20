class EventEmitter {
  constructor() {
    this.events = new Map();
    // Node.js 默认最大监听器数量是 10
    this.maxListeners = 10;
  }

  // 设置最大监听器数量
  setMaxListeners(n) {
    if (n < 0 || !Number.isInteger(n)) {
      throw new RangeError("MaxListeners must be a non-negative number");
    }
    this.maxListeners = n;
    return this;
  }

  // 获取最大监听器数量
  getMaxListeners() {
    return this.maxListeners;
  }

  // 添加事件监听器
  on(eventName, listener) {
    return this.addListener(eventName, listener);
  }

  addListener(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("The listener must be a function");
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName);

    // 检查是否超过最大监听器数量
    if (listeners.length >= this.maxListeners) {
      console.warn(
        `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${listeners.length} ${eventName} listeners added. Use emitter.setMaxListeners() to increase limit`
      );
    }

    listeners.push(listener);

    // 触发 newListener 事件
    if (eventName !== "newListener") {
      this.emit("newListener", eventName, listener);
    }

    return this;
  }

  // 一次性事件监听器
  once(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("The listener must be a function");
    }

    const onceWrapper = (...args) => {
      this.removeListener(eventName, onceWrapper);
      listener.apply(this, args);
    };

    // 保存原始的监听器引用，用于后续移除
    Object.defineProperty(onceWrapper, "originalListener", {
      value: listener,
      enumerable: false,
      writable: false,
      configurable: true,
    });

    return this.addListener(eventName, onceWrapper);
  }

  // 移除事件监听器
  removeListener(eventName, listener) {
    const listeners = this.events.get(eventName);

    if (listeners) {
      const index = listeners.findIndex((l) => {
        return l === listener || l.originalListener === listener;
      });

      if (index !== -1) {
        listeners.splice(index, 1);
        // 触发 removeListener 事件
        this.emit("removeListener", eventName, listener);
      }

      if (listeners.length === 0) {
        this.events.delete(eventName);
      }
    }

    return this;
  }

  off(eventName, listener) {
    return this.removeListener(eventName, listener);
  }

  // 移除所有监听器
  removeAllListeners(eventName) {
    if (eventName) {
      if (this.events.has(eventName)) {
        this.events.delete(eventName);
      }
    } else {
      this.events.clear();
    }
    return this;
  }

  // 触发事件
  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);

    if (!listeners || listeners.length === 0) {
      // 特殊处理 error 事件
      if (eventName === "error") {
        const error = args[0];
        throw error instanceof Error
          ? error
          : new Error("Unhandled error: " + error);
      }
      return false;
    }

    // 创建副本来遍历,避免在触发过程中的修改影响迭代
    const listenersToCall = [...listeners];

    for (const listener of listenersToCall) {
      try {
        listener.apply(this, args);
      } catch (error) {
        console.error("Error in event listener:", error);
        this.emit("error", error);
      }
    }

    return true;
  }

  // 获取事件名列表
  eventNames() {
    return Array.from(this.events.keys());
  }

  // 获取指定事件的监听器数量
  listenerCount(eventName) {
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  // 获取指定事件的监听器列表
  listeners(eventName) {
    const listeners = this.events.get(eventName);
    return listeners ? [...listeners] : [];
  }

  // 在监听器列表开头添加监听器
  prependListener(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("The listener must be a function");
    }

    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    const listeners = this.events.get(eventName);
    listeners.unshift(listener);
    return this;
  }

  // 在监听器列表开头添加一次性监听器
  prependOnceListener(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("The listener must be a function");
    }

    const onceWrapper = (...args) => {
      this.removeListener(eventName, onceWrapper);
      listener.apply(this, args);
    };

    Object.defineProperty(onceWrapper, "originalListener", {
      value: listener,
      enumerable: false,
      writable: false,
      configurable: true,
    });

    return this.prependListener(eventName, onceWrapper);
  }
}

// 导出默认单例和类
module.exports = new EventEmitter();
module.exports.EventEmitter = EventEmitter;
