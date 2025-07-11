<template>
  <div class="pagination">
    <button 
      :disabled="!isFirstPage"
      @click="goToPage(links.first)"
    >
      Первая
    </button>
    
    <button
      v-for="(link, index) in meta.links"
      :key="index"
      @click="goToPage(link.url)"
      :class="{ active: link.active }"
      :disabled="!link.url || link.active"
      v-html="link.label"
    >
    </button>
    
    <button 
      :disabled="!isLastPage"
      @click="goToPage(links.last)"
    >
      Последняя
    </button>
  </div>
  
</template>

<script>
export default {
  props: {
    links: {
      type: Object,
      required: true
    },
    meta: {
      type: Object,
      required: true
    },
  },
  computed: {
    isLastPage() {
      return !!this.meta?.links[this.meta.links.length - 1]?.url
    },
    isFirstPage() {
      return !!this.meta?.links[0]?.url
    }
  },
  methods: {
    goToPage(url) {
      if (!url) return;
      this.$emit('page-changed', url);
    }
  }
  
};
</script>

<style>
.pagination {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin: 2rem 0;
  justify-content: center;
}

.pagination button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background: #000;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #eee;
}

.pagination button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>