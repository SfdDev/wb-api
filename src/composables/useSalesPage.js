import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { useRouter, useRoute } from 'vue-router';
import { usePageFilters } from '@/composables/usePageFilters';

export function useSalesPage() {
  const router = useRouter();
  const route = useRoute();
  const defaultFilters = {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  };
  
  const { filters, updateFilters, clearFilters } = usePageFilters('sales', defaultFilters);

  const { fetchData, data, loading, error } = useAPI('/sales');

  onMounted(() => {
    loadData();
  });

  function refreshData() {
    filters.page = 1;
    loadData();
  }

  async function loadData() {
    const params = {
      ...filters
    };
    await fetchData(params).then(() => {
      filters.limit = data.value.meta.per_page;
    });
  }

  function handlePageChange(url) {
    const page = new URL(url).searchParams.get('page');
    filters.page = parseInt(page) || 1;
    loadData();
  }

  const chartData = computed(() => {
    if (!data.value?.data) return { labels: [], datasets: [] };
    const labels = data.value.data.map((_, i) => `Запись ${i + 1}`);
    const values = data.value.data.map(item => item.finished_price || 0);
    return {
      labels,
      datasets: [{
        label: 'Цена продажи',
        data: values,
        borderColor: '#42b883',
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
    clearFilters
  };
} 