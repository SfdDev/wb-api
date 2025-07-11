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
  import { useHomePage } from '@/composables/useHomePage';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';

const {
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
  refreshData
} = useHomePage();
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