<template>
  <Line
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)


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

const chartOptions = {
  responsive: true,
  aspectRatio: 6,
  plugins: {
    legend: { position: 'top' },
    title: { display: false }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
</style>