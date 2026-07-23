const BASE_URL = 'https://waseworm.ru/api/v1';

const getApiKey = () => {
  return import.meta.env.VITE_WW_API_KEY;
};

const apiFetch = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': getApiKey(),
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      },
    });

    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const resetTime = response.headers.get('X-RateLimit-Reset');

    if (remaining !== null) {
      console.log(`[RateLimit] Осталось запросов: ${remaining} из ${limit || 60}`);
    }

    if (response.status === 429) {
      let timeoutMessage = 'Пожалуйста, подождите минуту перед повторным запросом.';
      
      if (resetTime) {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        const secondsLeft = Math.max(0, Number(resetTime) - currentUnixTime);
        timeoutMessage = `Лимит запросов исчерпан. Подождите ${secondsLeft} сек.`;
      }
      
      alert(`Ошибка 429: ${timeoutMessage}`);
      throw new Error(`Rate limit exceeded (429). ${timeoutMessage}`);
    }

    if (response.status === 401) {
      console.error('Ошибка 401: Указан неверный X-API-KEY или он отсутствует в файле .env');
      alert('Ошибка авторизации: Проверьте правильность API-ключа в файле .env');
      return null;
    }

    if (!response.ok) {
      throw new Error(`Ошибка сервера: Статус ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Произошел сбой при обращении к ${endpoint}:`, error);
    return null;
  }
};

export const fetchProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.search) queryParams.append('search', params.search);
  if (params.availability) queryParams.append('availability', params.availability);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.offset !== undefined) queryParams.append('offset', params.offset);

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
  
  const data = await apiFetch(endpoint);
  
  return data || { items: [], total: 0, limit: 20, offset: 0 };
};

export const fetchProductById = async (id) => {
  if (!id) return null;
  const data = await apiFetch(`/products/${id}`);
  return data;
};

export const fetchCategories = async () => {
  const data = await apiFetch('/categories');
  return data || [];
};