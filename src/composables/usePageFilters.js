import { reactive, watch, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function usePageFilters(pageKey, defaultFilters = {}) {
  const route = useRoute();
  const router = useRouter();
  const STORAGE_KEY = `${pageKey}-filters`;

  // 1. Восстанавливаем фильтры из localStorage или query, иначе дефолтные
  let initial = { ...defaultFilters };
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      initial = { ...initial, ...parsed };
    } catch {}
  }
  // query имеет приоритет
  Object.keys(defaultFilters).forEach(key => {
    if (route.query[key]) initial[key] = route.query[key];
  });

  const filters = reactive({ ...initial });

  // 2. Сохраняем фильтры в localStorage и query при изменении
  watch(
    () => ({ ...filters }),
    (newFilters) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      router.replace({ query: { ...route.query, ...newFilters } });
    },
    { deep: true }
  );

  // 3. Следим за изменением query (например, при прямом переходе по ссылке)
  watch(
    () => route.query,
    (newQuery) => {
      Object.keys(defaultFilters).forEach(key => {
        if (newQuery[key] !== undefined && newQuery[key] !== filters[key]) {
          filters[key] = newQuery[key];
        }
      });
    }
  );

  // 4. Методы для обновления и сброса фильтров
  function updateFilters(newFilters) {
    Object.keys(newFilters).forEach(key => {
      if (filters[key] !== undefined) filters[key] = newFilters[key];
    });
  }
  function clearFilters() {
    Object.keys(defaultFilters).forEach(key => {
      filters[key] = defaultFilters[key];
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    ...toRefs(filters),
    filters,
    updateFilters,
    clearFilters
  };
} 