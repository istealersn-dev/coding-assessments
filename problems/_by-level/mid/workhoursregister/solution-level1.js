class WorkhoursRegisterM {
    constructor() {
      // Store workers with their information
      this.workers = {};
      // Track which workers are currently in the office
      this.inOffice = {};
    }
  
    /**
     * Adds a worker to the system
     * @param {string} workerId - The worker's ID
     * @param {string} position - The worker's position
     * @param {number} compensation - The worker's compensation
     * @returns {boolean} - True if worker was added, false if worker already exists
     */
    addWorker(workerId, position, compensation) {
      // Check if worker already exists
      if (workerId in this.workers) {
        return false;
      }
  
      // Add worker to the system
      this.workers[workerId] = {
        position: position,
        compensation: compensation,
        totalTimeWorked: 0,
        // For future levels, we might need this history
        workSessions: []
      };
  
      return true;
    }
  
    /**
     * Registers when a worker enters or leaves the office
     * @param {string} workerId - The worker's ID
     * @param {number} timestamp - The timestamp of entry/exit
     * @returns {string} - "registered" if successful, "invalid_request" if worker doesn't exist
     */
    register(workerId, timestamp) {
      // Check if worker exists
      if (!(workerId in this.workers)) {
        return "invalid_request";
      }
  
      // If worker is not in office, register entry
      if (!(workerId in this.inOffice)) {
        this.inOffice[workerId] = timestamp;
      } 
      // If worker is in office, register exit and calculate time worked
      else {
        const entryTime = this.inOffice[workerId];
        const timeWorked = timestamp - entryTime;
        
        // Update total time worked
        this.workers[workerId].totalTimeWorked += timeWorked;
        
        // Store the work session
        this.workers[workerId].workSessions.push({
          entry: entryTime,
          exit: timestamp,
          duration: timeWorked
        });
        
        // Remove worker from inOffice tracking
        delete this.inOffice[workerId];
      }
  
      return "registered";
    }
  
    /**
     * Gets the total time a worker has spent in the office (only counting completed sessions)
     * @param {string} workerId - The worker's ID
     * @returns {number|null} - Total time worked or null if worker doesn't exist
     */
    get(workerId) {
      // Check if worker exists
      if (!(workerId in this.workers)) {
        return null;
      }
      
      return this.workers[workerId].totalTimeWorked;
    }
  }
  
  // Export the class for testing
  module.exports = WorkhoursRegisterM;