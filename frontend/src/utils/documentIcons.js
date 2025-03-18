// frontend/src/utils/documentIcons.js

/**
 * Get the appropriate icon and color for a document file type
 * @param {string} fileType - The file type (e.g., 'pdf', 'docx')
 * @returns {Object} - Object containing icon class and color class
 */
export const getDocumentTypeIcon = (fileType) => {
    const type = fileType ? fileType.toLowerCase() : 'unknown';
    
    switch (type) {
      case 'pdf':
        return { icon: 'bi-file-earmark-pdf', color: 'danger' };
      case 'doc':
      case 'docx':
        return { icon: 'bi-file-earmark-word', color: 'primary' };
      case 'xls':
      case 'xlsx':
        return { icon: 'bi-file-earmark-excel', color: 'success' };
      case 'ppt':
      case 'pptx':
        return { icon: 'bi-file-earmark-ppt', color: 'warning' };
      case 'txt':
        return { icon: 'bi-file-earmark-text', color: 'secondary' };
      case 'zip':
      case 'rar':
      case '7z':
        return { icon: 'bi-file-earmark-zip', color: 'dark' };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return { icon: 'bi-file-earmark-image', color: 'info' };
      case 'mp4':
      case 'avi':
      case 'mov':
        return { icon: 'bi-file-earmark-play', color: 'danger' };
      case 'mp3':
      case 'wav':
      case 'ogg':
        return { icon: 'bi-file-earmark-music', color: 'warning' };
      case 'html':
      case 'css':
      case 'js':
        return { icon: 'bi-file-earmark-code', color: 'primary' };
      default:
        return { icon: 'bi-file-earmark', color: 'secondary' };
    }
  };
  
  /**
   * Get the appropriate badge class for document access level
   * @param {string} access - The access level (e.g., 'public', 'restricted')
   * @returns {string} - Bootstrap badge color class
   */
  export const getAccessBadgeClass = (access) => {
    switch (access) {
      case 'public':
        return 'success';
      case 'internal':
        return 'info';
      case 'restricted':
        return 'warning';
      case 'private':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  /**
   * Get the appropriate badge class for document status
   * @param {string} status - The document status (e.g., 'published', 'draft')
   * @returns {string} - Bootstrap badge color class
   */
  export const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'secondary';
      default:
        return 'info';
    }
  };
  
  /**
   * Format file size in a human-readable format
   * @param {string|number} size - The file size (can be a string like "2.4 MB" or a number in bytes)
   * @returns {string} - Formatted file size
   */
  export const formatFileSize = (size) => {
    // If already formatted as string with units, return it
    if (typeof size === 'string' && size.includes(' ')) {
      return size;
    }
    
    // Convert to number if it's a string representing a number
    const bytes = typeof size === 'string' ? parseInt(size, 10) : size;
    
    // If not a valid number, return original or empty string
    if (isNaN(bytes) || bytes === null) {
      return size || '';
    }
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;
    let formattedSize = bytes;
    
    while (formattedSize >= 1024 && i < units.length - 1) {
      formattedSize /= 1024;
      i++;
    }
    
    return `${formattedSize.toFixed(1)} ${units[i]}`;
  };
  
  /**
   * Format a date for display
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export default {
    getDocumentTypeIcon,
    getAccessBadgeClass,
    getStatusBadgeClass,
    formatFileSize,
    formatDate
  };