const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'token';



export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || 'Ocurrió un error al procesar la solicitud'
      );
    }

    return data;
  } catch (error) {
    const errorMessage = error.message || 'Ocurrió un error inesperado al conectar con el servidor';
    console.error(`[API Error] ${options.method || 'GET'} ${endpoint}:`, errorMessage);
    throw error;
  }
}