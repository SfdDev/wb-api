<template>
  <div>
    <h2>Склады</h2>
    <div class="filters">
      <input type="date" :value="formattedToday" readonly />
    </div>
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

// Получаем сегодняшнюю дату для отображения в input
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const formattedToday = `${yyyy}-${mm}-${dd}`;
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