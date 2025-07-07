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
            <span v-html="item[col.key]"></span>
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
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>

<style>
.top-change-table {
  margin-top: 1rem;
}
.table-container {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, td {
  border: 1px solid #eee;
  padding: 0.5rem;
  text-align: center;
}

.up {
  color: #42b883;
}
.down {
  color: #e74c3c;
}
</style>