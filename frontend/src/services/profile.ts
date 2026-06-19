
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseURL =  'http://localhost:8000';
  
  // Get auth token
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  
  const url = `${baseURL}${endpoint}`;
  
  console.log('API Request URL:', url); 
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', 
    });
    
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export default apiFetch;