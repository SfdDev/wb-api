import { createRouter, createWebHistory } from 'vue-router';
import SalesView from '../views/SalesView.vue';
import OrdersView from '../views/OrdersView.vue';
import IncomesView from '../views/IncomesView.vue';
import HomeView from '../views/Home.vue';
import StocksView from '../views/StocksView.vue';

const routes = [
  { path: '/sales', component: SalesView },
  { path: '/orders', component: OrdersView },
  { path: '/incomes', component: IncomesView },
  { path: '/stocks', component: StocksView },
  { path: '/home', component: HomeView },
  { path: '/', redirect: '/home' }
];

export default createRouter({
  history: createWebHistory(),
  routes
});