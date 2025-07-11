<template>
  <div>
    <h2>Доходы</h2>
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
      <ChartComponent chart-id="incomes-chart" :chart-data="chartData" chart-type="line" />
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
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import Pagination from '@/components/Pagination.vue';

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
  endpoint: '/incomes',
  filterKey: 'incomes',
  defaultFilters: {
    dateFrom: '2025-01-01',
    dateTo: '2025-12-31',
    page: 1,
    limit: 10
  },
  chartField: 'barcode',
  chartLabel: 'Штрих-код',
  chartColor: '#42b883',
  columns: [
    { key: 'date', label: 'Дата' },
    { key: 'nm_id', label: 'Номер айди' }
  ]
});
</script>