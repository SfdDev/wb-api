<template>
  <div>
    <h2>Склады</h2>

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
    
    <ChartComponent
      chart-id="sales-chart"
      :chart-data="chartData"
      chart-type="line"
    />
    
    <DataTable
      :data="data?.data || []"
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
import { ref, computed, onMounted } from 'vue';  
import { useAPI } from '@/composables/useAPI';
import ChartComponent from '@/components/ChartComponent.vue';
import DataTable from '@/components/DataTable.vue';
import Pagination from '@/components/Pagination.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const formatted = `${yyyy}-${mm}-${dd}`;

const defaultFilters = ref({
  dateFrom: formatted,
  page: 1,
  limit: 10 
});

const filters = ref({
  ...defaultFilters.value,
  ...route.query
});

onMounted(() => {
  loadData();
});

const { fetchData, data, loading, error } = useAPI('/stocks');

function refreshData() {
  filters.value.page = 1;
  syncRouteParams();
  loadData();
}

async function loadData() {
  const params = {
    ...filters.value
  };
  
  await fetchData(params).then(() => {
    filters.value.limit = data.value?.meta?.per_page || defaultFilters.value.limit;
    syncRouteParams();
  });
}

function syncRouteParams() {
  router.push({ query: { ...route.query, ...filters.value } });
}

function handlePageChange(url) {
  const page = new URL(url).searchParams.get('page');
  filters.value.page = parseInt(page) || 1;
  syncRouteParams();
  loadData();
}

const chartData = computed(() => {
  if (!data.value?.data) return { labels: [], datasets: [] };

  const labels = data.value.data.map((_, i) => `Запись ${i + 1}`);
  const values = data.value.data.map(item => item.price || 0);

  return {
    labels,
    datasets: [{
      label: 'Цена',
      data: values,
      borderColor: '#42b883',
      fill: false
    }]
  };
});
</script>