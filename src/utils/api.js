// API configuration utility
const API_URL = process.env.REACT_APP_API_URL || 'http://3.89.251.26:8000';

export const getApiUrl = () => API_URL;

// Named export instead of anonymous default export to fix ESLint warning
const apiUtils = {
  getApiUrl
};

export default apiUtils;
