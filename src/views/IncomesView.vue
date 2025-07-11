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
      <ChartComponent chart-id="sales-chart" :chart-data="chartData" chart-type="line" />
      <DataTable :data="data?.data || []"
        :columns="[
          { key: 'date', label: 'Дата' },
          { key: 'nm_id', label: 'Номер айди' }
        ]"
      />
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
import { useIncomesPage } from '@/composables/useIncomesPage';
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
  handlePageChange
} = useIncomesPage();
</script>