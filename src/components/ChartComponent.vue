<template>
 <div @click="handleClick" style="cursor:pointer;">
    <Line :options="chartOptions" :data="chartData" />
  </div>
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
import { useRouter } from 'vue-router';

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

const emit = defineEmits(['chart-click']);
function handleClick() {
  emit('chart-click', props.chartId);
}

const router = useRouter();

function goToChartPage(type) {
  // Например, переход на /sales или /chart/sales
  router.push({ path: `/${type}` });
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
</style>