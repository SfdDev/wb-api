<template>
  <div class="chart-wrapper">
    <canvas :id="chartId" ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: []
    })
  },
  chartType: {
    type: String,
    default: 'bar',
    validator: v => ['bar', 'line', 'pie', 'doughnut'].includes(v)
  }
});

const chartInstance = ref(null);
const chartCanvas = ref(null);

onMounted(() => {
  const canvas = chartCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (!props.chartData.labels?.length || !props.chartData.datasets?.length) {
    return;
  }

  chartInstance.value = new Chart(ctx, {
    type: props.chartType,
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: false }
      }
    }
  });
});

watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance.value && newData && newData.labels?.length && newData.datasets?.length) {
      chartInstance.value.data = newData;
      chartInstance.value.update();
    } else {
      console.warn('Не удалось обновить график: некорректные данные');
    }
  },
  { deep: true }
);
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
</style>