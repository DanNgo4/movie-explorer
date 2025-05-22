<script setup>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
 import { store } from "@/store";

 import * as MovieMutations from "@/infrastructure/mutations/movie-mutations";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

const router = useRouter();

const movieId = Number(props.id);

onMounted(async () => {
  await MovieMutations.retrieve(movieId);
  console.log(store.curentMovie);
});
</script>
<template>hello</template>
