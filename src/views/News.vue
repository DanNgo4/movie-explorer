<script setup>
import { ref, onMounted, computed } from "vue";
import Paginator from "primevue/paginator";

const news = ref([]);
const first = ref(0);
const rows = ref(3);

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}/news.json`);

    news.value = (await response.json()).news;
  } catch (error) {
    console.error("Failed to load news.json:", error);
  }
});

const pagedNews = computed(() => {
  return news.value.slice(first.value, first.value + rows.value);
});

function onPage(event) {
  first.value = event.first;
  rows.value = event.rows;
}
</script>

<template>
  <ul class="list-group mb-3">
    <li
      v-for="item in pagedNews"
      :key="item.id || item.title"
      class="list-group-item"
    >
      {{ item.title }}
    </li>
  </ul>

  <Paginator
    :rows="rows"
    :totalRecords="news.length"
    :rowsPerPageOptions="[1, 3, 5]"
    :showFirstLastPageLink="true"
    :showPageLinks="true"
    :showCurrentPageReport="true"
    @page="onPage"
  />

  <!-- <Paginator
    :first="first"
    :rows="rows"
    :total-records="news.length"
    :page-link-size="3"
    :rows-per-page-options="[10, 20, 50]"
    :show-first-last-page-link="true"
    :show-page-links="true"
    :show-current-page-report="true"
    @page="onPage"
  /> -->
</template>

<style scoped>
</style>
