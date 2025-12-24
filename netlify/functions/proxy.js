const https = require('https');
const http = require('http');

exports.handler = async function(event, context) {
  // The API endpoint we want to forward requests to - ensure it's accessible from Netlify's servers
  // Use HTTP so the function can reach the EC2 app without tripping the self-signed cert
  const API_ENDPOINT = 'http://3.89.251.26:8000';
  
  console.log('Netlify function invoked with path:', event.path);
  console.log('Request headers:', JSON.stringify(event.headers));
  
  // Handle OPTIONS preflight requests immediately
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'text/plain'
      },
      body: ''
    };
  }
  
  // Get the path and query parameters from the request
  // Strip the Netlify function path prefix
  const path = event.path.replace('/.netlify/functions/proxy', '');
  
  // Handle empty paths and add /api prefix if needed
  let normalizedPath = path || '/';
  
  // Always ensure the path starts with /api for the backend
  if (!normalizedPath.startsWith('/api')) {
    // Handle gomoku routes specially
    if (normalizedPath === '/gomoku/move' || normalizedPath === '/gomoku/start') {
      normalizedPath = `/api${normalizedPath}`;
      console.log(`Special handling for gomoku endpoint: ${normalizedPath}`);
    } 
    // For other endpoints without /api prefix
    else {
      normalizedPath = `/api${normalizedPath}`;
      console.log(`Adding /api prefix to path: ${normalizedPath}`);
    }
  } else {
    console.log(`Path already has /api prefix: ${normalizedPath}`);
  }
  
  // Build query string
  const queryString = event.queryStringParameters 
    ? Object.keys(event.queryStringParameters)
        .map(key => `${key}=${encodeURIComponent(event.queryStringParameters[key])}`)
        .join('&') 
    : '';
  
  // Construct the URL for the API request
  const url = `${API_ENDPOINT}${normalizedPath}${queryString ? '?' + queryString : ''}`;
  
  // Log the constructed URL for debugging
  console.log(`Constructed API URL: ${url}`);
  console.log(`Original path: ${path}`);
  console.log(`HTTP method: ${event.httpMethod}`);
  
  // Debug logging
  console.log(`Proxying ${event.httpMethod} request to: ${url}`);
  if (event.body) {
    const bodyPreview = event.body.length > 200 ? `${event.body.substring(0, 200)}...` : event.body;
    console.log(`Request body: ${bodyPreview}`);
  }
  
  // Select http or https module based on the URL
  const client = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    // Forward all original headers
    const headers = {};
    
    // Copy original headers, but filter out some that can cause issues
    for (const [key, value] of Object.entries(event.headers)) {
      // Skip headers that can cause conflicts
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    
    // Override specific headers
    headers['Content-Type'] = event.headers['content-type'] || 'application/json';
    
    // Add X-Forwarded headers
    headers['X-Forwarded-For'] = event.headers['client-ip'] || event.headers['x-forwarded-for'] || '';
    headers['X-Forwarded-Proto'] = event.headers['x-forwarded-proto'] || 'https';
    headers['X-Forwarded-Host'] = event.headers['host'] || '';
    
    // Use proper Host header for target service
    headers['Host'] = new URL(API_ENDPOINT).host;
    
    const options = {
      method: event.httpMethod,
      headers: headers
    };
    
    // If it's a request with body, make sure Content-Length is set correctly
    if (['POST', 'PUT', 'PATCH'].includes(event.httpMethod) && event.body) {
      const buffer = Buffer.from(event.body, 'utf8');
      options.headers['Content-Length'] = buffer.length;
    }
    
    const req = client.request(url, options, (res) => {
      // Handle binary data (images, etc.) vs text data
      const isBinary = res.headers['content-type'] && 
                       (res.headers['content-type'].includes('image/') || 
                        res.headers['content-type'].includes('application/octet-stream'));
      
      let body;
      if (isBinary) {
        // For binary data, collect chunks in a buffer array
        const chunks = [];
        res.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        res.on('end', () => {
          // Convert chunks to Buffer and then to base64 for Lambda response
          const buffer = Buffer.concat(chunks);
          body = buffer.toString('base64');
          
          console.log(`Response status: ${res.statusCode}`);
          console.log('Response headers:', JSON.stringify(res.headers));
          console.log(`Binary response (${res.headers['content-type']}) - size: ${buffer.length} bytes`);
          
          // Copy all response headers
          const responseHeaders = {
            'Content-Type': res.headers['content-type'] || 'application/octet-stream',
            // Always add CORS headers
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
          };
          
          // Copy other important headers from the backend
          ['cache-control', 'etag', 'last-modified', 'content-disposition'].forEach(header => {
            if (res.headers[header]) {
              responseHeaders[header] = res.headers[header];
            }
          });
          
          // Return binary response
          resolve({
            statusCode: res.statusCode,
            headers: responseHeaders,
            body: body,
            isBase64Encoded: true  // Tell Lambda this is base64 encoded
          });
        });
      } else {
        // For text data, use string concatenation
        let bodyStr = '';
        res.on('data', (chunk) => {
          bodyStr += chunk;
        });
        
        res.on('end', () => {
          console.log(`Response status: ${res.statusCode}`);
          console.log('Response headers:', JSON.stringify(res.headers));
          
          // Special handling for Gomoku move endpoint
          if (url.includes('/api/gomoku/move')) {
            console.log('Gomoku move response status:', res.statusCode);
            console.log('Gomoku move full response body:', bodyStr);
            
            // Handle non-200 responses for gomoku move endpoint
            if (res.statusCode !== 200) {
              console.error(`Error in Gomoku move response: ${bodyStr}`);
            }
          }
          
          // Copy all response headers
          const responseHeaders = {
            'Content-Type': res.headers['content-type'] || 'application/json',
            // Always add CORS headers
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
          };
          
          // Copy other important headers from the backend
          ['cache-control', 'etag', 'last-modified'].forEach(header => {
            if (res.headers[header]) {
              responseHeaders[header] = res.headers[header];
            }
          });
          
          // Log summary of response
          if (bodyStr) {
            const bodyPreview = bodyStr.length > 200 ? `${bodyStr.substring(0, 200)}...` : bodyStr;
            console.log(`Response body preview: ${bodyPreview}`);
          }
          
          // If we have a 4xx or 5xx response, make sure to include error details in the body
          if (res.statusCode >= 400) {
            console.error(`Error from API: ${res.statusCode}`);
            try {
              // Try to parse the body as JSON to extract error details
              const errorBody = JSON.parse(bodyStr);
              // Format the error response for the frontend
              const errorResponse = {
                error: `Error making ${normalizedPath.replace('/api/', '')}: ${res.statusCode}`,
                message: errorBody.detail || errorBody.message || bodyStr,
                status: res.statusCode
              };
              resolve({
                statusCode: res.statusCode,
                headers: responseHeaders,
                body: JSON.stringify(errorResponse)
              });
            } catch (e) {
              // If parsing fails, return the raw body
              resolve({
                statusCode: res.statusCode,
                headers: responseHeaders,
                body: JSON.stringify({
                  error: `Error making ${normalizedPath.replace('/api/', '')}: ${res.statusCode}`,
                  message: bodyStr,
                  status: res.statusCode
                })
              });
            }
          } else {
            // Normal successful response
            resolve({
              statusCode: res.statusCode,
              headers: responseHeaders,
              body: bodyStr
            });
          }
        });
      }
    });
    
    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      console.error(`Failed URL: ${url}`);
      console.error(`Method: ${event.httpMethod}`);
      console.error(`Headers: ${JSON.stringify(headers)}`);
      
      if (event.body) {
        console.error(`Request body: ${event.body.substring(0, 500)}`);
      }
      
      resolve({
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        },
        body: JSON.stringify({ 
          error: 'Error connecting to API server',
          message: `Failed to connect to backend server: ${e.message}. This could be due to CORS restrictions or the server being unavailable. Please ensure the API server at ${API_ENDPOINT} is running and accessible.`,
          url: url,
          method: event.httpMethod
        }),
      });
    });
    
    // Add a timeout to the request - increased to 30s for long-running operations like catmouse
    req.setTimeout(30000, () => {
      console.error(`Request to ${url} timed out after 30s`);
      resolve({
        statusCode: 504,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        },
        body: JSON.stringify({ 
          error: 'Request timed out',
          message: 'The request to the API server timed out. Please try again later.',
          url: url,
          method: event.httpMethod
        }),
      });
    });
    
    // Send request body if present
    if (event.body) {
      req.write(event.body);
    }
    
    req.end();
  });
};
