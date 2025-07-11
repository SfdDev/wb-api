<template>
  <div>
    <h2>Склады</h2>
    <div class="filters">
      <input type="date" :value="getToday()" readonly />
    </div>
    <div v-if="loading">Загрузка данных...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else>
      <ChartComponent chart-id="stocks-chart" :chart-data="chartData" chart-type="line" />
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
import { useTablePage } from '@/composables/useTablePage';
import { useUtils } from '@/composables/useUtils'; // импортируем утилиту
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import Pagination from '@/components/Pagination.vue';

const { getToday } = useUtils(); // получаем функцию

const {
  filters,
  data,
  loading,
  error,
  chartData,
  refreshData,
  handlePageChange,
  columns
} = useTablePage({
  endpoint: '/stocks',
  filterKey: 'stocks',
  defaultFilters: {
    page: 1,
    limit: 10
  },
  chartField: 'price',
  chartLabel: 'Цена',
  chartColor: '#42b883',
  columns: [
    { key: 'price', label: 'Цена' },
    { key: 'warehouse_name', label: 'Склад' }
  ],
  getRequestParams: (filters) => ({
    dateFrom: getToday(),
    page: filters.page,
    limit: filters.limit
  })
});
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}
.filters input[readonly] {
  background: #f5f5f5;
  color: #888;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
}
</style>