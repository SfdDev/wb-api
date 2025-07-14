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

   
      <div class="chart-block">
        <h3>Сумма продаж</h3>
        <ChartComponent
          chart-id="sales"
          :chart-data="salesChartData"
          chart-type="line"
          @chart-click="goToChartPage"
        />
        <DataTable
          :data="salesTopChanges"
          :columns="topChangeColumns"
        />
      </div>

      <div class="chart-block">
        <h3>Количество заказов</h3>
        <ChartComponent
          chart-id="orders"
          :chart-data="ordersChartData"
          chart-type="line"
          @chart-click="goToChartPage"
        />
        <DataTable  
          :data="ordersTopChanges"
          :columns="topChangeColumns"
        />
      </div>

      <div class="chart-block">
        <h3>Процент скидки</h3>
        <ChartComponent
          chart-id="stocks"
          :chart-data="stocksChartData"
          chart-type="line"
          @chart-click="goToChartPage"
        />
        <DataTable
          :data="stocksTopChanges"
          :columns="topChangeColumns"
        />
      </div>

      <div class="chart-block">
        <h3>ID дохода</h3>
        <ChartComponent
          chart-id="incomes"
          :chart-data="incomesChartData"
          chart-type="line"
          @chart-click="goToChartPage"
        />
        <DataTable
          :data="incomesTopChanges"
          :columns="topChangeColumns"
        />
      </div>
   
  </div>
</template>

<script setup>
import { useDataPage } from '@/composables/useDataPage';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const {
  filters,
  salesTopChanges,
  salesChartData,
  ordersTopChanges,
  ordersChartData,
  incomesTopChanges,
  incomesChartData,
  stocksTopChanges,
  stocksChartData,
  topChangeColumns,
  refreshData
} = useDataPage({
  mode: 'dashboard',
  endpoints: ['/sales', '/orders', '/incomes', '/stocks'],
  filterKey: 'home',
  defaultFilters: {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  },
  config: [
    {
      key: 'sales',
      typeField: 'total_price',
      valueField: 'total_price',
      chartField: 'total_price',
      chartLabel: 'Сумма продаж',
      chartColor: '#42b883'
    },
    {
      key: 'orders',
      typeField: 'total_price',
      valueField: 'total_price',
      chartField: 'total_price',
      chartLabel: 'Сумма заказов',
      chartColor: '#ffa500'
    },
    {
      key: 'incomes',
      typeField: 'income_id',
      valueField: 'income_id',
      chartField: 'income_id',
      chartLabel: 'ID дохода',
      chartColor: '#e74c3c'
    },
    {
      key: 'stocks',
      typeField: 'price',
      valueField: 'price',
      chartField: 'price',
      chartLabel: 'Сумма остатков',
      chartColor: '#007bff'
    }
  ]
});

function goToChartPage(page) {
  router.push({ path: `/${page}` });
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