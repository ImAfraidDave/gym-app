<template>
  <q-page class="flex flex-center">
    <main>
      <div v-for="(workout, id) in pastWorkouts" v-bind:key="id">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ convertTimestamp(workout.dateTime) }}</div>
            <div class="text-p">{{ workout.duration }}m</div>
          </q-card-section>
          <q-separator />
          <q-card-section
            v-for="(exercise, exerciseId) in workout.exercises"
            v-bind:key="exerciseId"
          >
            <q-card>
              <div class="text-h6">{{ exercise.exerciseName }}</div>
              <q-separator />
              <ul v-for="(set, index) in exercise.sets" v-bind:key="index">
                <li>{{ set.reps }} x {{ set.weight }}kg</li>
              </ul>
            </q-card>
          </q-card-section>
        </q-card>
      </div>
    </main>
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
