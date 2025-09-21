class InMemoryDatabase {
    constructor() {
      this.database = {};
      this.ttls = {};
    }
  
    // Level 1 methods
    set(key, field, value) {
      // Initialize record if it doesn't exist
      if (!this.database[key]) {
        this.database[key] = {};
      }
      
      // Set field-value pair
      this.database[key][field] = value;
      
      return true;
    }
  
    get(key, field) {
      // Check if key exists
      if (!this.database[key]) {
        return null;
      }
      
      // Check if field exists
      if (!(field in this.database[key])) {
        return null;
      }
      
      return this.database[key][field];
    }
  
    delete(key, field) {
      // Check if key exists
      if (!this.database[key]) {
        return false;
      }
      
      // Check if field exists
      if (!(field in this.database[key])) {
        return false;
      }
      
      // Delete field
      delete this.database[key][field];
      
      // Clean up empty records
      if (Object.keys(this.database[key]).length === 0) {
        delete this.database[key];
      }
      
      return true;
    }
  
    scan(key) {
      // Check if key exists
      if (!this.database[key]) {
        return [];
      }
      
      // Return all field-value pairs as formatted strings
      return Object.entries(this.database[key])
        .map(([field, value]) => `${field}(${value})`)
        .sort();
    }
  
    scanByPrefix(key, prefix) {
      // Check if key exists
      if (!this.database[key]) {
        return [];
      }
      
      // Filter fields by prefix and return formatted strings
      return Object.entries(this.database[key])
        .filter(([field]) => field.startsWith(prefix))
        .map(([field, value]) => `${field}(${value})`)
        .sort();
    }
  
    // Level 3 methods - TTL Support
    setAt(key, field, value, timestamp) {
      if (!this.database[key]) {
        this.database[key] = {};
      }
      
      this.database[key][field] = value;
      
      // Ensure the TTL tracking for this key-field exists
      if (!this.ttls[key]) {
        this.ttls[key] = {};
      }
      
      // Remove any existing TTL for this field (setting without TTL means no expiration)
      if (this.ttls[key][field]) {
        delete this.ttls[key][field];
      }
      
      return true;
    }
  
    setAtWithTtl(key, field, value, timestamp, ttl) {
      if (!this.database[key]) {
        this.database[key] = {};
      }
      
      this.database[key][field] = value;
      
      // Ensure the TTL tracking for this key-field exists
      if (!this.ttls[key]) {
        this.ttls[key] = {};
      }
      
      // Set the expiration timestamp
      this.ttls[key][field] = timestamp + ttl;
      
      return true;
    }
  
    deleteAt(key, field, timestamp) {
      // First check for TTL expiration
      if (this.isExpired(key, field, timestamp)) {
        return false;
      }
      
      // Check if key exists
      if (!this.database[key]) {
        return false;
      }
      
      // Check if field exists
      if (!(field in this.database[key])) {
        return false;
      }
      
      // Delete field
      delete this.database[key][field];
      
      // Clean up TTL tracking
      if (this.ttls[key] && this.ttls[key][field]) {
        delete this.ttls[key][field];
      }
      
      // Clean up empty records
      if (Object.keys(this.database[key]).length === 0) {
        delete this.database[key];
        if (this.ttls[key]) {
          delete this.ttls[key];
        }
      }
      
      return true;
    }
  
    getAt(key, field, timestamp) {
      // Check if key exists
      if (!this.database[key]) {
        return null;
      }
      
      // Check if field exists
      if (!(field in this.database[key])) {
        return null;
      }
      
      // Check for TTL expiration
      if (this.isExpired(key, field, timestamp)) {
        return null;
      }
      
      return this.database[key][field];
    }
  
    scanAt(key, timestamp) {
      // Check if key exists
      if (!this.database[key]) {
        return [];
      }
      
      // Filter out expired fields and return formatted strings
      return Object.entries(this.database[key])
        .filter(([field]) => !this.isExpired(key, field, timestamp))
        .map(([field, value]) => `${field}(${value})`)
        .sort();
    }
  
    scanByPrefixAt(key, prefix, timestamp) {
      // Check if key exists
      if (!this.database[key]) {
        return [];
      }
      
      // Filter fields by prefix and check TTL, then return formatted strings
      return Object.entries(this.database[key])
        .filter(([field]) => field.startsWith(prefix) && !this.isExpired(key, field, timestamp))
        .map(([field, value]) => `${field}(${value})`)
        .sort();
    }
  
    // Helper method to check if a field has expired
    isExpired(key, field, timestamp) {
      if (this.ttls[key] && this.ttls[key][field] && timestamp >= this.ttls[key][field]) {
        // The field has expired, clean it up
        delete this.database[key][field];
        delete this.ttls[key][field];
        
        // Clean up empty records
        if (Object.keys(this.database[key]).length === 0) {
          delete this.database[key];
          delete this.ttls[key];
        }
        
        return true;
      }
      
      return false;
    }
  }
  
  module.exports = InMemoryDatabase;