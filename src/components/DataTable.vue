<template>
  <div class="table-container">
    <table v-if="data && data.length > 0" class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in data" :key="idx">
          <td v-for="col in columns" :key="col.key">
            {{ item[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="no-data">
      Нет данных для отображения.
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  // Массив записей из API
  data: {
    type: Array,
    default: () => []
  },
  // Массив колонок вида: [{ key: 'total_price', label: 'Сумма продаж' }, ...]
  columns: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}
</style>