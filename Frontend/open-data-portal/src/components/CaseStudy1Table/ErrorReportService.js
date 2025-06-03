import axios from 'axios';

/**
 * Service to handle error report related operations
 */
class ErrorReportService {
  /**
   * Submit a new error report
   * @param {Object} reportData - The report data object
   * @param {Array} reportData.itemIds - Array of item IDs being reported
   * @param {string} reportData.errorType - Type of error
   * @param {string} reportData.description - Description of the error
   * @param {string} reportData.reporter - Name of the reporter (optional)
   * @returns {Promise} - Promise resolving to the saved report
   */
  async submitReport(reportData) {
    try {
      const response = await axios.post('http://localhost:8080/apiV1/errorReports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }
  
  /**
   * Get all error reports
   * @param {Object} filters - Optional filters for the reports
   * @returns {Promise} - Promise resolving to array of reports
   */
  async getReports(filters = {}) {
    try {
      const response = await axios.get('http://localhost:8080/apiV1/errorReports', {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }
  
  /**
   * Update report status
   * @param {number} reportId - ID of the report to update
   * @param {string} status - New status ('Resolved' or 'Unresolved')
   * @returns {Promise} - Promise resolving to the updated report
   */
  async updateReportStatus(reportId, status) {
    try {
      const response = await axios.patch(`http://localhost:8080/apiV1/errorReports/${reportId}`, { 
        status 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }
}

export default new ErrorReportService();
