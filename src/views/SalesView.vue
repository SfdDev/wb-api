<template>
  <div>
    <h2>Продажи</h2>
    <form @submit.prevent="refreshData">
      <div class="filters">
        <input v-model="filters.dateFrom" type="date">
        <input v-model="filters.dateTo" type="date">
        <button type="submit">Применить фильтры</button>
      </div>
    </form>
    <div v-if="loading">Загрузка данных...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else>
      <ChartComponent chart-id="sales-chart" :chart-data="chartData" chart-type="line" />
      <DataTable :data="data?.data || []" :columns="columns" />
      <Pagination
        v-if="data?.meta"
        :links="data.links"
        :meta="data.meta"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { useDataPage } from '@/composables/useDataPage';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import Pagination from '@/components/Pagination.vue';

const {
  data,
  loading,
  error,
  chartData,
  columns,
  filters,
  refreshData,
  handlePageChange
} = useDataPage({
  mode: 'table',
  endpoints: ['/sales'],
  filterKey: 'sales',
  defaultFilters: {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  },
  config: {
    chartField: 'total_price',
    chartLabel: 'Сумма',
    chartColor: '#42b883',
    columns: [
      { key: 'date', label: 'Дата' },
      { key: 'barcode', label: 'Штрих-код' },
      { key: 'total_price', label: 'Сумма' },
      { key: 'warehouse_name', label: 'Склад' }
    ]
  }
});
</script>