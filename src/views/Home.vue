<template>
    <div>
      <h2>Аналитика заказов</h2>
  
      <form @submit.prevent="refreshData">
        <div class="filters">
          <input v-model="filters.dateFrom" type="date">
          <input v-model="filters.dateTo" type="date">
          <button type="submit">Применить фильтры</button>
        </div>
      </form>
  
      <div v-if="loading">Загрузка данных...</div>
      <div v-else-if="error" class="text-danger">{{ error }}</div>
      <template v-else>

        <div class="chart-block">
          <h3>Сумма продаж</h3>
          <ChartComponent
            chart-id="sales-total"
            :chart-data="chartDataTotalPrice"
            chart-type="line"
          />
          <DataTable
            :data="topTotalPriceChanges"
            :columns="topChangeColumns"
          />
       
        </div>
  
        <div class="chart-block">
          <h3>Количество заказов</h3>
          <ChartComponent
            chart-id="orders-count"
            :chart-data="chartDataOrdersCount"
            chart-type="line"
          />
          <DataTable  
            :data="topOrdersCountChanges"
            :columns="topChangeColumns"
          />
          
        </div>
  
        <div class="chart-block">
          <h3>Процент скидки</h3>
          <ChartComponent
            chart-id="discount-percent"
            :chart-data="chartDataAverageCheck"
            chart-type="line"
          />
   
          <DataTable
            :data="topDiscountPercentChanges"
            :columns="topChangeColumns"
          />
        </div>
  
        <div class="chart-block">
          <h3>ID дохода</h3>
          <ChartComponent
            chart-id="income-id"
            :chart-data="chartDataNewUsers"
            chart-type="line"
          />
          <DataTable
            :data="topIncomeIdChanges"
            :columns="topChangeColumns"
          />
        </div>
        
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
import { useAPI } from '@/composables/useAPI';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import { useRouter, useRoute } from 'vue-router';
import { useTable } from '@/composables/useTable';
 
  const router = useRouter();
  const route = useRoute();
 
  const defaultFilters = ref({
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  });
  
  const filters = ref({
    ...defaultFilters.value,
    ...route.query
  });

const { filteredDataByType, getTopChanges } = useTable();

const chartDataTotalPrice = computed(() => makeChartData('total_price', 'Сумма продаж', '#42b883'));
const chartDataOrdersCount = computed(() => makeChartData('orders_count', 'Количество заказов', '#2c3e50'));
const chartDataAverageCheck = computed(() => makeChartData('discount_percent', 'Процент скидки', '#e74c3c'));
const chartDataNewUsers = computed(() => makeChartData('income_id', 'ID дохода', '#f39c12'));

const topTotalPriceChanges = computed(() => getTopChanges('total_price', 'total_price', data, prevData));
const topOrdersCountChanges = computed(() => getTopChanges('orders_count', 'count', data, prevData));
const topDiscountPercentChanges = computed(() => getTopChanges('discount_percent', 'discount_percent', data, prevData));
const topIncomeIdChanges = computed(() => getTopChanges('income_id', 'income_id', data, prevData));

const topChangeColumns = [  
  { key: 'nm_id', label: 'Артикул' },
  { key: 'currentValue', label: 'Текущий период' },
  { key: 'prevValue', label: 'Предыдущий период' },
  { key: 'percentChange', label: 'Изменение (%)' },
  { key: 'arrows', label:""}
];
  
const { fetchData, data, loading, error } = useAPI('/orders');
const { fetchData: fetchPrevData, data: prevData } = useAPI('/orders');

onMounted(() => {
  loadData();
});

function refreshData() {
  filters.value.page = 1;
  syncRouteParams();
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
    ...filters.value
  };
  await fetchData(params).then(async () => {
    filters.value.limit = data.value.meta.per_page;
    syncRouteParams();
    const prev = getPreviousPeriod(filters.value.dateFrom, filters.value.dateTo);
    await fetchPrevData({ ...params, dateFrom: prev.dateFrom, dateTo: prev.dateTo });
  });
}

function syncRouteParams() {
    router.push({ query: { ...route.query, ...filters.value } });
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
  
  </script>
  
  <style>
  .chart-block {
    margin-bottom: 3rem;
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
  }
  
  .filters input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3aa876;
  }
  </style>