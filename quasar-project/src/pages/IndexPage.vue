<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <q-btn label="Finish Workout" @click="stopWorkout" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <q-input v-model="exerciseName" type="text" label="Exercise" />
    <p>Timer: {{ formattedTime }}</p>
    <q-card> Exercise Name </q-card>
    <q-card-section>
      <q-btn :icon="matAdd" @click="addSet(exerciseName)" />
      <div v-for="(set, index) in sets" v-bind:key="index">
        <p>{{ set.exerciseName }}</p>
        <q-input
          v-model="set.reps"
          type="number"
          label="Reps"
          min="0"
          step="1"
          @update:model-value="saveToLocalStorage"
        />
        <q-input
          v-model="set.weight"
          type="number"
          label="Weight (kg)"
          min="0"
          @update:model-value="saveToLocalStorage"
        />
        <q-btn :icon="matDelete" @click="deleteSet(index)" />
      </div>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { matDelete, matAdd } from '@quasar/extras/material-icons';

import { ref, computed, onMounted } from 'vue';

const sets = ref([]);
const time = ref(0);
const interval = ref(null);
const exerciseName = ref('');

const addSet = (exercise) => {
  sets.value.push({ exerciseName: exercise, reps: '', weight: '' });
  saveToLocalStorage();
};

const deleteSet = (index) => {
  sets.value.splice(index, 1);
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem('sets', JSON.stringify(sets.value));
};

const startWorkout = () => {
  startTimer();
  sets.value = []; // as a new workout is started, discard the current exercises from the previous workout
};

const stopWorkout = () => {
  stopTimer();

  // save the sets to localStorage

  time.value = 0;
  sets.value = [];
};

const startTimer = () => {
  if (interval.value) clearInterval(interval.value);

  interval.value = setInterval(() => {
    time.value += 1;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval.value);
};

function formatTimeUnit(unit) {
  return unit < 10 ? '0' + unit : unit; // if number is less than 10, add a leading 0
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

const formattedTime = computed(() => formatTime(time.value));

onMounted(() => {
  const savedSets = localStorage.getItem('sets');
  if (savedSets) {
    sets.value = JSON.parse(savedSets);
  }
});
</script>
