const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const requestOptions = {
    mode: 'cors' as RequestMode,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  console.log('Request Options:', requestOptions);

  const response = await fetch(endpoint, requestOptions);

  if (!response.ok) {
    throw new Error(`APIリクエストが失敗しました: ${response.statusText}`);
  }

  return response.json();
};

export default apiClient;
