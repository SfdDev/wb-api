import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { useRouter, useRoute } from 'vue-router';
import { usePageFilters } from '@/composables/usePageFilters';

export function useStocksPage() {
  const router = useRouter();
  const route = useRoute();
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formatted = `${yyyy}-${mm}-${dd}`;
  const defaultFilters = {
    dateFrom: formatted,
    page: 1,
    limit: 10
  };
  
  const { filters, updateFilters, clearFilters } = usePageFilters('stocks', defaultFilters);

  const { fetchData, data, loading, error } = useAPI('/stocks');

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
      filters.limit = data.value?.meta?.per_page || defaultFilters.limit;
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
    const values = data.value.data.map(item => item.price || 0);
    return {
      labels,
      datasets: [{
        label: 'Цена',
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