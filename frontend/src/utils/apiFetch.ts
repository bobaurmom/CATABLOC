const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = 'http://localhost:8000/api';
  
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // THIS IS THE KEY FOR COOKIES
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);
  
  if (response.status === 401 && endpoint !== '/auth/refresh-token') {
    const refreshRes = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (refreshRes.ok) {
      return fetch(`${baseUrl}${endpoint}`, defaultOptions);
    }
  }
  
  return response;
};
export default apiFetch;