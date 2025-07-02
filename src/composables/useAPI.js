import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY;

export function useAPI(endpoint) {
    const data = ref(null);
    const loading = ref(false);
    const error = ref(null);

    async function fetchData(params = {}) {
        loading.value = true;
        error.value = null;

        try {
            // Добавляем ключ в параметры
            params.key = API_SECRET_KEY;

            // Устанавливаем лимит по умолчанию
            if (!params.limit) params.limit = 500;

            const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
            data.value = response.data;
        } catch (err) {
            error.value = err.message || 'Ошибка загрузки данных';
        } finally {
            loading.value = false;
        }
    }

    return {
        data,
        loading,
        error,
        fetchData,
    };
}