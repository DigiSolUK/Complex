import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});

// Helper function to make API requests
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data !== undefined) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API request failed with status ${response.status}`;
    
    try {
      // Try to parse error response as JSON
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) {
        errorMessage = errorJson.message;
      } else if (typeof errorJson.error === 'string') {
        errorMessage = errorJson.error;
      }
    } catch (e) {
      // If error response is not valid JSON, use the text as is
      if (errorText) {
        errorMessage = errorText;
      }
    }
    
    throw new Error(errorMessage);
  }

  return response;
}

// Default query function that can be used with useQuery
type QueryFnOptions = {
  url?: string;
  on401?: 'returnNull' | 'throw';
};

export function getQueryFn(options: QueryFnOptions = {}) {
  const { on401 = 'throw' } = options;
  
  return async ({ queryKey }: { queryKey: [string, ...any[]] }) => {
    const [url, params] = queryKey;
    
    try {
      const response = await apiRequest('GET', url);
      
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      // Handle 401 Unauthorized according to options
      if (
        error instanceof Error && 
        error.message.includes('401') && 
        on401 === 'returnNull'
      ) {
        return null;
      }
      throw error;
    }
  };
}
