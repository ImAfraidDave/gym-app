<template>
  <q-page class="flex flex-center">
    <q-card>
      <h3>Past Workouts</h3>
      <p>Here you can view your past workouts.</p>

      <div v-for="(workout, id) in pastWorkouts" v-bind:key="id">
        <q-card>
          <p>{{ convertTimestamp(workout.dateTime) }}</p>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';

const pastWorkouts = ref([]);

/**
 * Converts timestamp to dd/mm/yyyy hh:mm format
 */
function convertTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0'); // gets the day as a number, appends 0 if needed
  const month = String(date.getMonth()).padStart(2, '0');
  const year = String(date.getFullYear());
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${min}`;
}

onMounted(() => {
  const historicWorkouts = localStorage.getItem('historicWorkouts');
  if (historicWorkouts) {
    pastWorkouts.value = JSON.parse(historicWorkouts);
  }
});
</script>
