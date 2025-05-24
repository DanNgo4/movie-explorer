<script setup>
import { ref, onMounted, computed } from "vue";
import Paginator from "primevue/paginator";

const news = ref([]);
const first = ref(0);
const rows = ref(3);

const searchTitle = ref("");
const searchContent = ref("");
const searchCategory = ref("");
const startDate = ref("");
const endDate = ref("");

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}/news.json`);

    news.value = (await response.json()).news;
  } catch (error) {
    console.error("Failed to load news.json:", error);
  }
});

const filteredNews = computed(() => {
  return news.value.filter(article => {
    const titleMatch = article.title
      .toLowerCase()
      .includes(searchTitle.value.toLowerCase());

    const contentMatch = article.content
      .toLowerCase()
      .includes(searchContent.value.toLowerCase());

    const categoryMatch = article.category
      .toLowerCase()
      .includes(searchCategory.value.toLowerCase());

    const articleDate = new Date(article.date);
    const isAfterStartDate = !startDate.value || articleDate >= new Date(startDate.value);
    const isBeforeEndDate = !endDate.value || articleDate <= new Date(endDate.value);
    const dateMatch = isAfterStartDate && isBeforeEndDate;

    return titleMatch && contentMatch && categoryMatch && dateMatch;
  });
});

const pagedNews = computed(() => {
  return filteredNews.value.slice(first.value, first.value + rows.value);
});

function onPage(event) {
  first.value = event.first;
  rows.value = event.rows;
}

const categories = computed(() => {
  return [...new Set(news.value.map(article => article.category))];
});

const truncateContent = (content, maxLength = 300) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};
</script>

<template>
  <article class="news-container">
    <section class="search-filters mb-4">
      <form role="search" aria-label="Filter news articles">
        <fieldset>
          <legend class="h5 mb-3">Filter News Articles</legend>

        <div class="row g-3">
          <div class="col-md-3">
            <label for="titleSearch" class="form-label">Title</label>

            <input id="titleSearch"
                   type="text"
                   v-model="searchTitle"
                   placeholder="Search by title..."
                   class="form-control"
                   aria-describedby="titleSearch-help" />
            <div id="titleSearch-help" class="form-text">Search for specific words in article titles</div>
          </div>

          <div class="col-md-3">
            <label for="contentSearch" class="form-label">Content</label>

            <input id="contentSearch"
                   type="text"
                   v-model="searchContent"
                   placeholder="Search by content..."
                   class="form-control"
                   aria-describedby="contentSearch-help" />
            <div id="contentSearch-help" class="form-text">Search within article content</div>
          </div>

          <div class="col-md-2">
            <label for="categorySelect" class="form-label">Category</label>

            <select
              id="categorySelect"
              v-model="searchCategory"
              class="form-select"
              aria-describedby="categorySelect-help"
            >
              <option value="">All Categories</option>

              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <div id="categorySelect-help" class="form-text">Filter by article category</div>
          </div>

          <div class="col-md-2">
            <label for="startDate" class="form-label">Start Date</label>

            <input id="startDate"
                   type="date"
                   v-model="startDate"
                   class="form-control"
                   aria-describedby="startDate-help" />
            <div id="startDate-help" class="form-text">Articles from this date onwards</div>
          </div>

          <div class="col-md-2">
            <label for="endDate" class="form-label">End Date</label>

            <input id="endDate"
                   type="date"
                   v-model="endDate"
                   class="form-control"
                   aria-describedby="endDate-help" />
            <div id="endDate-help" class="form-text">Articles up to this date</div>
          </div>
        </div>
        </fieldset>
      </form>
    </section>

    <section class="news-list">
      <div
        v-for="article in pagedNews"
        :key="article.title"
        class="card mb-3"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="card-title">{{ article.title }}</h5>
            <span class="badge bg-primary">{{ article.category }}</span>
          </div>

          <h6 class="card-subtitle mb-2 text-muted">
            {{ new Date(article.date).toLocaleDateString() }}
          </h6>

          <p class="card-text">{{ truncateContent(article.content) }}</p>

          <div class="mt-2">
            <a
              v-if="article.source"
              :href="article.source"
              target="_blank"
              class="card-link"
            >
              Read full article
            </a>
          </div>
        </div>
      </div>
    </section>

    <Paginator :rows="rows"
               :totalRecords="filteredNews.length"
               :rowsPerPageOptions="[3, 5, 10]"
               :showFirstLastPageLink="true"
               :showPageLinks="true"
               :showCurrentPageReport="true"
               @page="onPage"
               class="mt-3" />
  </article>
</template>

<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-filters {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.8rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.card-link {
  text-decoration: underline;
  color: blue;
}
</style>
