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
import { useDataPage } from '@/composables/useDataPage';
import { useUtils } from '@/composables/useUtils';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import Pagination from '@/components/Pagination.vue';

const { getToday } = useUtils();

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
  endpoints: ['/stocks'],
  filterKey: 'stocks',
  defaultFilters: {
    page: 1,
    limit: 10
  },
  config: {
    chartField: 'price',
    chartLabel: 'Цена',
    chartColor: '#007bff',
    columns: [
      { key: 'price', label: 'Цена' },
      { key: 'warehouse_name', label: 'Склад' }
    ]
  },
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