/**
 * Simplified in-memory database implementation
 */
class InMemoryDatabase {
    constructor() {
      // Main data storage structure, a nested object
      this.data = {};
    }
  
    /**
     * Sets a value for a field in a record
     * @param {string} key - The record key
     * @param {string} field - The field name 
     * @param {string} value - The value to set
     * @returns {string} - The value that was set
     */
    set(key, field, value) {
      // Initialize the record if it doesn't exist
      if (!this.data[key]) {
        this.data[key] = {};
      }
      
      // Set the field value
      this.data[key][field] = value;
      
      return value;
    }
  
    /**
     * Gets a value from a field in a record
     * @param {string} key - The record key
     * @param {string} field - The field name
     * @returns {string|null} - The value or null if not found
     */
    get(key, field) {
      // Check if the record exists
      if (!this.data[key]) {
        return null;
      }
      
      // Check if the field exists in the record
      if (!(field in this.data[key])) {
        return null;
      }
      
      return this.data[key][field];
    }
  
    /**
     * Deletes a field from a record
     * @param {string} key - The record key
     * @param {string} field - The field name to delete
     * @returns {boolean} - True if deleted, false if not found
     */
    del(key, field) {
      // Check if the record exists
      if (!this.data[key]) {
        return false;
      }
      
      // Check if the field exists in the record
      if (!(field in this.data[key])) {
        return false;
      }
      
      // Delete the field and return true
      delete this.data[key][field];
      return true;
    }
  
    /**
     * Returns a list of all fields and their values for a given record
     * @param {string} key - The record key
     * @returns {string[]} - List of "field(value)" strings
     */
    scan(key) {
      // If record doesn't exist, return empty list
      if (!this.data[key]) {
        return [];
      }
      
      // Get all fields, sort them lexicographically
      const fields = Object.keys(this.data[key]).sort();
      
      // Format the result as "field(value)"
      return fields.map(field => `${field}(${this.data[key][field]})`);
    }
  
    /**
     * Returns a list of fields and their values for a given record
     * where fields start with the given prefix
     * @param {string} key - The record key
     * @param {string} prefix - The field prefix to filter by
     * @returns {string[]} - List of "field(value)" strings
     */
    scanByPrefix(key, prefix) {
      // If record doesn't exist, return empty list
      if (!this.data[key]) {
        return [];
      }
      
      // Get all fields that match the prefix, sort them lexicographically
      const matchingFields = Object.keys(this.data[key])
        .filter(field => field.startsWith(prefix))
        .sort();
      
      // Format the result as "field(value)"
      return matchingFields.map(field => `${field}(${this.data[key][field]})`);
    }
  }
  
  // Export the database class
  module.exports = InMemoryDatabase;