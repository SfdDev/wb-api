import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import { useTable } from '@/composables/useTable';
import { usePageFilters } from '@/composables/usePageFilters';
import { useUtils } from '@/composables/useUtils';

export function useHomePage() {
  const defaultFilters = {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  };
  const { filters, updateFilters, clearFilters } = usePageFilters('home', defaultFilters);
  const { getTopChanges } = useTable();
  const { getToday } = useUtils();
  // SALES
  const { data: salesData, fetchData: fetchSales, loading: salesLoading, error: salesError } = useAPI('/sales');
  const { data: salesPrevData, fetchData: fetchSalesPrev } = useAPI('/sales');
  // ORDERS
  const { data: ordersData, fetchData: fetchOrders, loading: ordersLoading, error: ordersError } = useAPI('/orders');
  const { data: ordersPrevData, fetchData: fetchOrdersPrev } = useAPI('/orders');
  // INCOMES
  const { data: incomesData, fetchData: fetchIncomes, loading: incomesLoading, error: incomesError } = useAPI('/incomes');
  const { data: incomesPrevData, fetchData: fetchIncomesPrev } = useAPI('/incomes');
  // STOCKS
  const { data: stocksData, fetchData: fetchStocks, loading: stocksLoading, error: stocksError } = useAPI('/stocks');
  const { data: stocksPrevData, fetchData: fetchStocksPrev } = useAPI('/stocks');

  // Функция для расчёта предыдущего периода (оставить!)
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

  // Колонки для всех таблиц одинаковые
  const topChangeColumns = [
    { key: 'nm_id', label: 'Артикул' },
    { key: 'currentValue', label: 'Текущий период' },
    { key: 'prevValue', label: 'Предыдущий период' },
    { key: 'percentChange', label: 'Изменение (%)' },
    { key: 'arrows', label: '' }
  ];

  // Chart data (можно оставить как есть, если нужно)
  function makeChartData(field, label, color, data) {
    console.log(data);
    if (!data?.value?.data) return { labels: [], datasets: [] };
    const arr = data.value.data;
    const labels = arr.map((_, i) => `Запись ${i + 1}`);
    const values = arr.map(item => item[field] || 0);
    return {
      labels,
      datasets: [{ label, data: values, borderColor: color, fill: false, tension: 0.4 }]
    };
  }

  // Top changes для каждого блока
  const salesTopChanges = computed(() => getTopChanges('total_price', 'total_price', salesData, salesPrevData));
  const ordersTopChanges = computed(() => getTopChanges('total_price', 'total_price', ordersData, ordersPrevData));
  const incomesTopChanges = computed(() => getTopChanges('quantity', 'quantity', incomesData, incomesPrevData));
  const stocksTopChanges = computed(() => getTopChanges('price', 'price', stocksData, stocksPrevData));

  // Chart data для каждого блока
  const salesChartData = computed(() => makeChartData('total_price', 'Сумма продаж', '#42b883', salesData));
  const ordersChartData = computed(() => makeChartData('total_price', 'Сумма заказов', '#ffa500', ordersData));
  const incomesChartData = computed(() => makeChartData('quantity', 'Сумма доходов', '#e74c3c', incomesData));
  const stocksChartData = computed(() => makeChartData('price', 'Сумма остатков', '#007bff', stocksData));

  // Загрузка всех данных при монтировании и при обновлении фильтров
  onMounted(() => {
    refreshAll();
  });

  async function refreshAll() {
    // Текущий период
    await Promise.all([
      fetchSales({ ...filters }),
      fetchOrders({ ...filters }),
      fetchIncomes({ ...filters }),
      fetchStocks({ dateFrom: getToday(), page: filters.page, limit: filters.limit })
    ]);
    // Предыдущий период (если есть даты)
    if (filters.dateFrom && filters.dateTo) {
      const prev = getPreviousPeriod(filters.dateFrom, filters.dateTo);
      await Promise.all([
        fetchSalesPrev({ ...filters, dateFrom: prev.dateFrom, dateTo: prev.dateTo }),
        fetchOrdersPrev({ ...filters, dateFrom: prev.dateFrom, dateTo: prev.dateTo }),
        fetchIncomesPrev({ ...filters, dateFrom: prev.dateFrom, dateTo: prev.dateTo }),
        fetchStocksPrev({ dateFrom: getToday(), page: filters.page, limit: filters.limit })
      ]);
    }
  }

  return {
    filters,
    updateFilters,
    clearFilters,
    // SALES
    salesData,
    salesTopChanges,
    salesChartData,
    // ORDERS
    ordersData,
    ordersTopChanges,
    ordersChartData,
    // INCOMES
    incomesData,
    incomesTopChanges,
    incomesChartData,
    // STOCKS
    stocksData,
    stocksTopChanges,
    stocksChartData,
    // Общее
    topChangeColumns,
    refreshAll,
    getPreviousPeriod
  };
} 