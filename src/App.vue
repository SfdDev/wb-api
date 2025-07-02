<template>
  <div id="app">
    <nav>
      <router-link to="/incomes">Incomes</router-link>
      <router-link to="/orders">Orders</router-link>
      <router-link to="/sales">Sales</router-link>
      <router-link to="/stocks">Stocks</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 20px;
  background-color: #f8f8f8;
  margin-bottom: 20px;
}

nav a {
  margin-right: 15px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>