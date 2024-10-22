class Cache {
  constructor() {
    this.cache = {};
  }

  set(key, value, ttl = 1000) {
    const expiry = Date.now() + ttl * 1000;
    this.cache[key] = { value, expiry };
  }

  get(key) {
    const cached = this.cache[key];

    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      delete this.cache[key];
      return null;
    }

    return cached;
  }

  delete(key) {
    delete this.cache[key];
  }
}

const cache = new Cache();
export default cache;
