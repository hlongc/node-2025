class EventEmitter {
  constructor() {
    this.map = new Map();
    this.maxListenerCount = 10;
  }

  on(eventName, cb) {
    return this.addListener(eventName, cb);
  }

  once(eventName, cb) {
    if (typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    return this.on(eventName, this.__wrapperOnce(eventName, cb));
  }

  off(eventName, cb) {
    return this.removeListener(eventName, cb);
  }

  __wrapperOnce(eventName, cb) {
    const wrapper = (...args) => {
      this.removeListener(eventName, wrapper);
      cb.apply(this, args);
    };

    Object.defineProperty(wrapper, "originalCallback", {
      value: cb,
      enumerable: false,
      writable: false,
      configurable: true,
    });

    return wrapper;
  }
  /**
   * Synchronously calls each of the listeners registered
   * for the event.
   * @param {string | symbol} eventName
   * @param {...any} [args]
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    if (!this.map.has(eventName)) {
      return false;
    }

    const callbackList = this.map.get(eventName);

    for (const callback of callbackList) {
      callback.apply(this, args);
    }

    return true;
  }

  prependOnceListener(eventName, cb) {
    if (typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    return this.prependListener(eventName, this.__wrapperOnce(eventName, cb));
  }

  prependListener(eventName, cb) {
    if (typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    if (!this.map.has(eventName)) {
      this.map.set(eventName, []);
    }

    if (this.map.get(eventName).length >= this.maxListenerCount) {
      throw new RangeError(`最大设置${this.maxListenerCount}个监听器`);
    }

    if (eventName !== "newListener") {
      this.emit("newListener", eventName, cb);
    }

    this.map.get(eventName).unshift(cb);

    return this;
  }

  addListener(eventName, cb) {
    if (typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    if (!this.map.has(eventName)) {
      this.map.set(eventName, []);
    }

    if (this.map.get(eventName).length >= this.maxListenerCount) {
      throw new RangeError(`最大设置${this.maxListenerCount}个监听器`);
    }

    if (eventName !== "newListener") {
      this.emit("newListener", eventName, cb);
    }

    this.map.get(eventName).push(cb);

    return this;
  }

  removeListener(eventName, cb) {
    if (typeof cb !== "function") {
      throw new TypeError("cb must be a function");
    }

    if (!this.map.has(eventName)) {
      return;
    }

    const list = this.map.get(eventName);
    const index = list.findIndex(
      (fn) => fn === cb || fn.originalCallback === cb
    );

    if (index > -1) {
      list.splice(index, 1);
      this.emit("removeListener", eventName, cb);
    }

    if (list.length === 0) {
      this.map.delete(eventName);
    }

    return this;
  }

  removeAllListeners(eventName) {
    if (!eventName) {
      this.map.clear();
    } else {
      this.map.delete(eventName);
    }

    return this;
  }

  eventNames() {
    return Array.from(this.map.keys());
  }

  setMaxListeners(maxCount) {
    this.maxListenerCount = maxCount;
    return this;
  }

  getMaxListeners() {
    return this.maxListenerCount;
  }

  listenerCount(eventName, listener) {
    const listeners = this.map.get(eventName);

    if (!listeners) {
      return 0;
    }

    if (!listener) {
      return listeners.length;
    }

    return listeners.filter((cb) => cb === listener).length;
  }

  listeners(eventName) {
    const callbackList = this.map.get(eventName);

    if (!callbackList) {
      return [];
    }

    return callbackList.slice();
  }
}

module.exports = new EventEmitter();
module.exports.EventEmitter = EventEmitter;
