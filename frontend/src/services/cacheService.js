// Cache service for localStorage management
const CACHE_PREFIX = 'vibekart_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

class CacheService {
  constructor(key) {
    this.key = CACHE_PREFIX + key;
  }

  // Get cached data if valid
  get() {
    try {
      const cached = localStorage.getItem(this.key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (this.isValid(timestamp)) {
        console.log(`✅ Cache hit for ${this.key}`);
        return data;
      } else {
        console.log(`⏰ Cache expired for ${this.key}`);
        this.clear();
        return null;
      }
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  // Save data to cache with timestamp
  set(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.key, JSON.stringify(cacheData));
      console.log(`💾 Cached ${this.key}`);
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // Check if cached data is still valid
  isValid(timestamp) {
    return Date.now() - timestamp < CACHE_DURATION;
  }

  // Clear specific cache
  clear() {
    localStorage.removeItem(this.key);
  }

  // Clear all app caches
  static clearAll() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Cleared all caches');
  }
}

// Export cache instances for different data types
export const productsCache = new CacheService('products');
export const categoriesCache = new CacheService('categories');

export default CacheService;
