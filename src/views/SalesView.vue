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
      <DataTable :data="data?.data || []"
        :columns="[
          { key: 'date', label: 'Дата' },
          { key: 'barcode', label: 'Штрих-код' },
          { key: 'total_price', label: 'Сумма' },
          { key: 'warehouse_name', label: 'Склад' }
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
import { useSalesPage } from '@/composables/useSalesPage';
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
} = useSalesPage();
</script>