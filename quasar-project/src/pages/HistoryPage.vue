<template>
  <q-page class="flex flex-center">
    <main>
      <div v-for="(workout, id) in pastWorkouts" v-bind:key="id">
        <q-card>
          <q-card-section>
            <div class="text-p">{{ convertTimestamp(workout.dateTime) }}</div>
            <div class="text-p">{{ workout.duration }}m</div>
          </q-card-section>
          <q-separator />
          <q-card-section
            v-for="(exercise, exerciseId) in workout.exercises"
            v-bind:key="exerciseId"
          >
            <q-card>
              <div class="text-h6">{{ exercise.name }}</div>
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
 * Converts timestamp to EEEE, d MMMM yyyy hh:mma format
 */
function convertTimestamp(timestamp) {
  const date = new Date(timestamp);

  const convertedDate = date.toLocaleString('en-NZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return convertedDate;
}

onMounted(() => {
  const historicWorkouts = localStorage.getItem('historicWorkouts');
  if (historicWorkouts) {
    pastWorkouts.value = JSON.parse(historicWorkouts);
  }
});
</script>
