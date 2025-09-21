class Database {
    constructor() {
      this.data = {};
      this.ttls = {};
      this.backups = [];
    }
  
    // Level 1: Basic operations
    setAt(recordId, fieldId, value, timestamp) {
      this.checkAndRemoveExpired(timestamp);
      
      if (!this.data[recordId]) {
        this.data[recordId] = {};
      }
      
      this.data[recordId][fieldId] = value;
      
      return true;
    }
  
    setAtWithTtl(recordId, fieldId, value, timestamp, ttl) {
      if (this.setAt(recordId, fieldId, value, timestamp)) {
        if (!this.ttls[recordId]) {
          this.ttls[recordId] = {};
        }
        
        this.ttls[recordId][fieldId] = {
          expiresAt: timestamp + ttl,
          initialTimestamp: timestamp,
          initialTtl: ttl
        };
        
        return true;
      }
      
      return false;
    }
  
    getAt(recordId, fieldId, timestamp) {
      this.checkAndRemoveExpired(timestamp);
      
      if (this.data[recordId] && this.data[recordId][fieldId] !== undefined) {
        return this.data[recordId][fieldId];
      }
      
      return null;
    }
  
    deleteAt(recordId, fieldId, timestamp) {
      this.checkAndRemoveExpired(timestamp);
      
      if (this.data[recordId] && this.data[recordId][fieldId] !== undefined) {
        delete this.data[recordId][fieldId];
        
        if (this.ttls[recordId] && this.ttls[recordId][fieldId]) {
          delete this.ttls[recordId][fieldId];
        }
        
        // Clean up empty records
        if (Object.keys(this.data[recordId]).length === 0) {
          delete this.data[recordId];
          delete this.ttls[recordId];
        }
        
        return true;
      }
      
      return false;
    }
  
    // Level 2: Scanning records
    scanAt(recordId, timestamp) {
      this.checkAndRemoveExpired(timestamp);
      
      if (!this.data[recordId]) {
        return [];
      }
      
      const result = [];
      const fields = Object.keys(this.data[recordId]).sort();
      
      for (const fieldId of fields) {
        const value = this.data[recordId][fieldId];
        result.push(`${fieldId}(${value})`);
      }
      
      return result;
    }
  
    // Helper method to check and remove expired records
    checkAndRemoveExpired(timestamp) {
      for (const recordId in this.ttls) {
        for (const fieldId in this.ttls[recordId]) {
          if (this.ttls[recordId][fieldId].expiresAt <= timestamp) {
            // Field has expired
            if (this.data[recordId] && this.data[recordId][fieldId] !== undefined) {
              delete this.data[recordId][fieldId];
              delete this.ttls[recordId][fieldId];
              
              // Clean up empty records
              if (Object.keys(this.data[recordId]).length === 0) {
                delete this.data[recordId];
                delete this.ttls[recordId];
                break; // No need to continue checking fields for this record
              }
            }
          }
        }
      }
    }
  
    // Level 4: Backup and restore functionality
    backup(timestamp) {
      this.checkAndRemoveExpired(timestamp);
      
      // Count non-empty records
      let nonEmptyRecordsCount = 0;
      for (const recordId in this.data) {
        if (Object.keys(this.data[recordId]).length > 0) {
          nonEmptyRecordsCount++;
        }
      }
      
      // Create a deep copy of the current state
      const backupData = JSON.parse(JSON.stringify(this.data));
      const backupTtls = JSON.parse(JSON.stringify(this.ttls));
      
      this.backups.push({
        timestamp,
        data: backupData,
        ttls: backupTtls
      });
      
      return nonEmptyRecordsCount;
    }
  
    restore(timestamp, timestampToRestore) {
      // Find the latest backup before or at timestampToRestore
      let backupToRestore = null;
      
      for (let i = this.backups.length - 1; i >= 0; i--) {
        if (this.backups[i].timestamp <= timestampToRestore) {
          backupToRestore = this.backups[i];
          break;
        }
      }
      
      if (!backupToRestore) {
        return; // No suitable backup found (this should not happen as per problem statement)
      }
      
      // Restore data
      this.data = JSON.parse(JSON.stringify(backupToRestore.data));
      
      // Restore ttls with recalculated expiration times
      this.ttls = {};
      for (const recordId in backupToRestore.ttls) {
        this.ttls[recordId] = {};
        
        for (const fieldId in backupToRestore.ttls[recordId]) {
          const ttlInfo = backupToRestore.ttls[recordId][fieldId];
          const elapsedTime = backupToRestore.timestamp - ttlInfo.initialTimestamp;
          const remainingTtl = ttlInfo.initialTtl - elapsedTime;
          
          // Only restore fields that weren't already expired at backup time
          if (remainingTtl > 0) {
            this.ttls[recordId][fieldId] = {
              expiresAt: timestamp + remainingTtl,
              initialTimestamp: timestamp,
              initialTtl: remainingTtl
            };
          } else {
            // Remove expired fields from restored data
            if (this.data[recordId] && this.data[recordId][fieldId] !== undefined) {
              delete this.data[recordId][fieldId];
              
              // Clean up empty records
              if (Object.keys(this.data[recordId]).length === 0) {
                delete this.data[recordId];
              }
            }
          }
        }
      }
      
      // Check for any expired records after restore
      this.checkAndRemoveExpired(timestamp);
    }
  }
  
  // Functions for external use
  let db = new Database();
  
  function setAt(recordId, fieldId, value, timestamp) {
    return db.setAt(recordId, fieldId, value, timestamp);
  }
  
  function setAtWithTtl(recordId, fieldId, value, timestamp, ttl) {
    return db.setAtWithTtl(recordId, fieldId, value, timestamp, ttl);
  }
  
  function getAt(recordId, fieldId, timestamp) {
    return db.getAt(recordId, fieldId, timestamp);
  }
  
  function deleteAt(recordId, fieldId, timestamp) {
    return db.deleteAt(recordId, fieldId, timestamp);
  }
  
  function scanAt(recordId, timestamp) {
    return db.scanAt(recordId, timestamp);
  }
  
  function backup(timestamp) {
    return db.backup(timestamp);
  }
  
  function restore(timestamp, timestampToRestore) {
    return db.restore(timestamp, timestampToRestore);
  }
  
  // Export all the functions
  module.exports = {
    setAt,
    setAtWithTtl,
    getAt,
    deleteAt,
    scanAt,
    backup,
    restore
  };