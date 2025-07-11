import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { usePageFilters } from '@/composables/usePageFilters';

export function useTablePage({
  endpoint,
  filterKey,
  defaultFilters,
  chartField,
  chartLabel,
  chartColor,
  columns,
  getRequestParams
}) {
  const { filters, updateFilters, clearFilters } = usePageFilters(filterKey, defaultFilters);
  const { fetchData, data, loading, error } = useAPI(endpoint);

  onMounted(() => {
    loadData();
  });

  function refreshData() {
    filters.page = 1;
    loadData();
  }

  async function loadData() {
    let params = { ...filters };
    if (typeof getRequestParams === 'function') {
      params = getRequestParams(filters);
    }
    await fetchData(params).then(() => {
      if (data.value?.meta?.per_page) {
        filters.limit = data.value.meta.per_page;
      }
    });
  }

  function handlePageChange(url) {
    const page = new URL(url).searchParams.get('page');
    filters.page = parseInt(page) || 1;
    loadData();
  }

  const chartData = computed(() => {
    if (!data.value?.data) return { labels: [], datasets: [] };
    const arr = data.value.data;
    const labels = arr.map((_, i) => `Запись ${i + 1}`);
    const values = arr.map(item => item[chartField] || 0);
    return {
      labels,
      datasets: [{
        label: chartLabel,
        data: values,
        borderColor: chartColor,
        fill: false
      }]
    };
  });

  return {
    filters,
    data,
    loading,
    error,
    chartData,
    refreshData,
    handlePageChange,
    updateFilters,
    clearFilters,
    columns
  };
} 