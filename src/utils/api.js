// API configuration utility
// Export directly for backward compatibility with existing imports
export const getApiUrl = () => {
  // Log host information for debugging
  console.log('Current hostname:', window.location.hostname);
  console.log('Current port:', window.location.port);
  
  // Use environment variable if available
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // If we're in development mode (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Check if we're using Netlify dev (port 8888 by default)
    if (window.location.port === '8888') {
      console.log('Detected Netlify Dev environment');
      return '/.netlify/functions/proxy';
    }
    // Default to direct backend URL for local development with HTTP instead of HTTPS to avoid cert issues
    console.log('Detected local development environment');
    return 'http://3.89.251.26:8000';
  }
  
  // In production with our Nginx setup
  if (window.location.hostname === '3.89.251.26') {
    console.log('Detected Nginx production environment');
    return '/api';  // This will be handled by Nginx proxy
  }
  
  // When deployed on Netlify or any custom domain through Netlify
  if (window.location.hostname.includes('netlify.app') || 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' &&
      window.location.hostname !== '3.89.251.26') {
    console.log('Detected Netlify or custom domain environment');
    return '/.netlify/functions/proxy';
  }
  
  // Fallback: use Netlify proxy for production to avoid mixed content issues
  if (process.env.NODE_ENV === 'production') {
    console.log('Using Netlify proxy to avoid mixed content (HTTPS -> HTTP)');
    return '/.netlify/functions/proxy';
  } else {
    console.log('Using development HTTP API URL');
    return 'http://3.89.251.26:8000';
  }
};

// Helper function to make API calls with proper headers
export const fetchApi = async (endpoint, options = {}) => {
  // Special handling for the Gomoku endpoints to ensure proper path formatting
  let formattedEndpoint = endpoint;
  
  // Special handling to ensure we don't have duplicate '/api' prefixes
  const baseUrl = getApiUrl();
  console.log('Base URL for fetch:', baseUrl);
  console.log('Original endpoint:', endpoint);
  
  // For Netlify or Nginx proxy paths that already include '/api'
  if ((baseUrl.includes('netlify') || baseUrl === '/api') && endpoint.startsWith('/api')) {
    // Strip the /api prefix since it's already handled by the proxy
    formattedEndpoint = endpoint.replace(/^\/api/, '');
    console.log('Modified endpoint (removed /api):', formattedEndpoint);
  }
  
  const url = `${baseUrl}${formattedEndpoint.startsWith('/') ? formattedEndpoint : '/' + formattedEndpoint}`;
  console.log('Final request URL:', url);
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  try {
    console.log(`Sending ${options.method || 'GET'} request to ${url}`);
    console.log('Request headers:', headers);
    if (options.body) console.log('Request body:', options.body);
    
    const response = await fetch(url, {
      ...options,
      headers,
      // Add these options to ensure cookies are sent and CORS issues are minimized
      credentials: 'same-origin',
      mode: 'cors'
    });
    
    console.log(`Response status from ${url}:`, response.status);
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Response headers:', responseHeaders);
    
    // Handle HTTP errors with more detailed logging
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // Try to parse error details from response
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.detail || errorJson.message || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || errorMessage;
        }
      } catch (readError) {
        console.error('Could not read error response:', readError);
      }
      
      throw new Error(errorMessage);
    }
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error(`API request to ${url} failed:`, error);
    throw error;
  }
};

// Named export instead of anonymous default export to fix ESLint warning
const apiUtils = {
  getApiUrl,
  fetchApi
};

export default apiUtils;
