<template>
  <div>
    <h2>Склады</h2>
    <form @submit.prevent="refreshData">
      <div class="filters">
        <input v-model="filters.dateFrom" type="date">
        <button type="submit">Применить фильтры</button>
      </div>
    </form>
    <div v-if="loading">Загрузка данных...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else>
      <ChartComponent chart-id="sales-chart" :chart-data="chartData" chart-type="line" />
      <DataTable :data="data?.data || []"
        :columns="[
          { key: 'price', label: 'Цена' },
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
import { useStocksPage } from '@/composables/useStocksPage';
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
} = useStocksPage();
</script>