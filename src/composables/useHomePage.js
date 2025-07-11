import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { useTable } from '@/composables/useTable';
import { usePageFilters } from '@/composables/usePageFilters';

export function useHomePage() {
  const defaultFilters = {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  };
  const { filters, updateFilters, clearFilters } = usePageFilters('home', defaultFilters);

  const { filteredDataByType, getTopChanges } = useTable();

  const { fetchData, data, loading, error } = useAPI('/orders');
  const { fetchData: fetchPrevData, data: prevData } = useAPI('/orders');

  const chartDataTotalPrice = computed(() => makeChartData('total_price', 'Сумма продаж', '#42b883'));
  const chartDataOrdersCount = computed(() => makeChartData('total_price', 'Количество заказов', '#2c3e50'));
  const chartDataAverageCheck = computed(() => makeChartData('discount_percent', 'Процент скидки', '#e74c3c'));
  const chartDataNewUsers = computed(() => makeChartData('income_id', 'ID дохода', '#f39c12'));

  const topTotalPriceChanges = computed(() => getTopChanges('total_price', 'total_price', data, prevData));
  const topOrdersCountChanges = computed(() => getTopChanges('total_price', 'count', data, prevData));
  const topDiscountPercentChanges = computed(() => getTopChanges('discount_percent', 'discount_percent', data, prevData));
  const topIncomeIdChanges = computed(() => getTopChanges('income_id', 'income_id', data, prevData));

  const topChangeColumns = [  
    { key: 'nm_id', label: 'Артикул' },
    { key: 'currentValue', label: 'Текущий период' },
    { key: 'prevValue', label: 'Предыдущий период' },
    { key: 'percentChange', label: 'Изменение (%)' },
    { key: 'arrows', label: "" }
  ];

  onMounted(() => {
    loadData();
  });

  function refreshData() {
    filters.page = 1;
    loadData();
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

  async function loadData() {
    const params = {
      ...filters
    };
    await fetchData(params).then(async () => {
      filters.limit = data.value.meta.per_page;
      const prev = getPreviousPeriod(filters.dateFrom, filters.dateTo);
      await fetchPrevData({ ...params, dateFrom: prev.dateFrom, dateTo: prev.dateTo });
    });
  }

  function makeChartData(field, label, color) {
    const filteredData = filteredDataByType(field, data);
    if (!filteredData.length) return { labels: [], datasets: [] };
    const labels = filteredData.map((_, i) => `Запись ${i + 1}`);
    const values = filteredData.map(item => {
      const val = item[field] || item[Object.keys(item)[1]];
      return val ? parseFloat(val) : 0;
    });
    return {
      labels,
      datasets: [{
        label,
        data: values,
        borderColor: color,
        fill: false,
        tension: 0.4
      }]
    };
  }

  return {
    filters,
    data,
    prevData,
    loading,
    error,
    chartDataTotalPrice,
    chartDataOrdersCount,
    chartDataAverageCheck,
    chartDataNewUsers,
    topTotalPriceChanges,
    topOrdersCountChanges,
    topDiscountPercentChanges,
    topIncomeIdChanges,
    topChangeColumns,
    refreshData,
    updateFilters,
    clearFilters
  };
} 