
<script setup>
import ChartComponent from '@/components/ChartComponent.vue'
import DataTable from '@/components/DataTable.vue'

const props = defineProps({
  title: String,                  // Заголовок блока
  type: String,                   // Тип данных (sales, orders, stocks, incomes)
  chartId: String,                // id для ChartComponent
  chartData: Object,              // Данные для графика
  chartType: String,              // Тип графика
  chartField: String,             // Поле для перехода на график
  topChanges: Array,              // Топ изменений для таблицы
  topChangeColumns: Array,        // Колонки таблицы
  loading: Boolean,
  error: [Boolean, String],
  navigateToChart: Function
});

const emit = defineEmits(['chart-click']);
</script>

<template>
  <div v-if="props.loading">Загрузка данных...</div>
  <div v-else-if="props.error" class="text-danger">Ошибка загрузки</div>
  <div v-else>
    <div class="chart-block">
      <h3>{{ props.title }}</h3>
      <ChartComponent
        v-if="props.chartData"
        :chart-id="props.chartId"
        :chart-data="props.chartData"
        :chart-type="props.chartType"
        @chart-click="() => props.navigateToChart(props.type, props.chartField)"
      />
      <DataTable
        :data="props.topChanges"
        :columns="props.topChangeColumns"
      />
    </div>
  </div>
</template>