import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { usePageFilters } from '@/composables/usePageFilters';
import { useTable } from '@/composables/useTable';
import { useUtils } from '@/composables/useUtils';

export function useDataPage({
  mode = 'table', // 'table' | 'dashboard'
  endpoints = [], // для dashboard: ['/sales', '/orders', '/incomes', '/stocks']
  filterKey,
  defaultFilters,
  config = {}, // конфигурация для каждого блока
  getRequestParams = null // кастомная функция для параметров запроса
}) {
  const { filters, updateFilters, clearFilters } = usePageFilters(filterKey, defaultFilters);
  const { getTopChanges } = useTable();
  const { getToday } = useUtils();

  // Создаём API-инстансы для каждого эндпоинта
  const apiInstances = endpoints.map(endpoint => {
    const { data, fetchData, loading, error } = useAPI(endpoint);
    return { endpoint, data, fetchData, loading, error };
  });

  // Для dashboard: создаём также prev-инстансы
  const prevApiInstances = mode === 'dashboard' ? endpoints.map(endpoint => {
    const { data, fetchData } = useAPI(endpoint);
    return { endpoint, data, fetchData };
  }) : [];

  onMounted(() => {
    loadData();
  });

  function refreshData() {
    filters.page = 1;
    loadData();
  }

  async function loadData() {
    if (mode === 'table') {
      // Простая загрузка для одной страницы
      const instance = apiInstances[0];
      let params = { ...filters };
      
      if (typeof getRequestParams === 'function') {
        params = getRequestParams(filters);
      }
      
      await instance.fetchData(params);
    } else {
      // Загрузка для dashboard
      await loadDashboardData();
    }
  }

  async function loadDashboardData() {
    // Текущий период
    await Promise.all(
      apiInstances.map((instance, index) => {
        let params = { ...filters };
        // Для stocks используем текущую дату
        if (config[index]?.key === 'stocks') {
          params = { dateFrom: getToday(), page: filters.page, limit: filters.limit };
        }
        return instance.fetchData(params);
      })
    );

    // Предыдущий период
    if (filters.dateFrom && filters.dateTo) {
      const prev = getPreviousPeriod(filters.dateFrom, filters.dateTo);
      console.log('Текущий период:', filters.dateFrom, filters.dateTo);
  console.log('Предыдущий период:', prev.dateFrom, prev.dateTo);
      await Promise.all(
        prevApiInstances.map((instance, index) => {
          let params = { ...filters, dateFrom: prev.dateFrom, dateTo: prev.dateTo };
          // Для stocks используем текущую дату
          if (config[index]?.key === 'stocks') {
            params = { dateFrom: getToday(), page: filters.page, limit: filters.limit };
          }
          return instance.fetchData(params);
        })
      );
    }
  }

  function getPreviousPeriod(dateFrom, dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = to - from;
    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo.getTime() - diff);
    return {
      dateFrom: prevFrom.toISOString().slice(0, 10),
      dateTo: prevTo.toISOString().slice(0, 10)
    };
  }

  function handlePageChange(url) {
    const page = new URL(url).searchParams.get('page');
    filters.page = parseInt(page) || 1;
    loadData();
  }

  // Формируем данные в зависимости от режима
  const result = {};

  if (mode === 'table') {
    // Для простых страниц
    const instance = apiInstances[0];
    const configItem = config;
    
    result.data = instance.data;
    result.loading = instance.loading;
    result.error = instance.error;
    result.filters = filters;
    result.chartData = computed(() => {
      if (!instance.data.value?.data) return { labels: [], datasets: [] };
      const arr = instance.data.value.data;
      const labels = arr.map((_, i) => `Запись ${i + 1}`);
      const values = arr.map(item => item[configItem.chartField] || 0);
      return {
        labels,
        datasets: [{
          label: configItem.chartLabel,
          data: values,
          borderColor: configItem.chartColor,
          fill: false
        }]
      };
    });
    result.columns = configItem.columns || [];
    result.handlePageChange = handlePageChange;
  } else {
    // Для dashboard
    result.filters = filters;
    result.topChangeColumns = [
      { key: 'nm_id', label: 'Артикул' },
      { key: 'currentValue', label: 'Текущий период' },
      { key: 'prevValue', label: 'Предыдущий период' },
      { key: 'percentChange', label: 'Изменение (%)' },
      { key: 'arrows', label: '' }
    ];

    // Формируем данные для каждого блока
    apiInstances.forEach((instance, index) => {
      const configItem = config[index] || {};
      const prevInstance = prevApiInstances[index];
      
      const key = configItem.key || `block${index}`;
      
      result[`${key}TopChanges`] = computed(() => 
        getTopChanges(
          configItem.typeField, 
          configItem.valueField, 
          instance.data.value?.data || [],
    prevInstance.data.value?.data || []
        )
      );
      
      result[`${key}ChartData`] = computed(() => {
        if (!instance.data.value?.data) return { labels: [], datasets: [] };
        const arr = instance.data.value.data;
        const labels = arr.map((_, i) => `Запись ${i + 1}`);
        const values = arr.map(item => item[configItem.chartField] || 0);
        return {
          labels,
          datasets: [{
            label: configItem.chartLabel,
            data: values,
            borderColor: configItem.chartColor,
            fill: false,
            tension: 0.4
          }]
        };
      });
    });
  }

  result.refreshData = refreshData;
  result.updateFilters = updateFilters;
  result.clearFilters = clearFilters;

  return result;
} 