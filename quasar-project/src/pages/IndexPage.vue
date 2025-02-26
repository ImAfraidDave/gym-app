<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <q-btn label="Finish Workout" @click="stopWorkout" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <!-- <q-input v-model="repCount" type="number" label="Rep" min="0" step="1" id="repCountTxt" />
    <q-input v-model="weight" type="number" label="Weight (kg)" min="0" id="weightTxt" />
    <q-btn label="Add" @click="addExercise" />
    <q-btn label="New Set" @click="addSet" /> -->
    <p>Timer: {{ formattedTime }}</p>
    <q-card> Exercise Name </q-card>
    <q-card-section>
      <div v-for="(set, index) in sets" v-bind:key="index">
        <q-input
          v-model="set.repCount"
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
        <q-btn :icon="matDelete" label="Remove Set" @click="removeSet(index)" stack />
      </div>
      <q-btn :icon="matAdd" label="New Set" @click="addSet" stack />
    </q-card-section>
  </q-page>
</template>

<script setup>
import { matDelete, matAdd } from '@quasar/extras/material-icons';

import { ref, computed, onMounted } from 'vue';

const time = ref(0);
let interval;

const startTimer = () => {
  if (interval) clearInterval(interval);

  interval = setInterval(() => {
    time.value += 1;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval);
};

function formatTimeUnit(unit) {
  return unit < 10 ? '0' + unit : unit; // if number is less than 10, add a leading 0
}

// let exerciseNumber = 0;

const startWorkout = () => {
  startTimer();
  // exerciseNumber = 0;
  exercises.length = 0; // as a new workout is started, discard the current exercises from the previous workout

  const card = document.createElement('section');
  card.classList.add('q-card');
  let page = document.getElementsByClassName('q-page')[0];
  if (page) {
    page.append(card);
  }
};

const stopWorkout = () => {
  stopTimer();
  var currWorkout = {};
  currWorkout.date = new Date().toLocaleString();
  currWorkout.duration = time.value;
  time.value = 0;
};

var exercises = []; // the exercises of the current workout.
// const repCount = ref(null);
// const weight = ref(null);

// /**
//  * Adds a set to the current workout.
//  */
// const addExercise = () => {
//   var exercise = {};
//   // exercise.name = // get the exercise name
//   exercise.reps = repCount.value;
//   exercise.weight = weight.value;
//   exercise.number = exerciseNumber++; // keeps track of order of exercises
//   exercises.push(exercise);
// };

const saveToLocalStorage = () => {
  localStorage.setItem('sets', JSON.stringify(sets.value));
};

// if there are saved sets in localStorage, use those, otherwise start with 1 blank set
const sets = ref([JSON.parse(localStorage.getItem('sets')) || [{ repCount: '', weight: '' }]]);

const addSet = () => {
  sets.value.push({ repCount: '', weight: '' });
  saveToLocalStorage();
};

const removeSet = (index) => {
  sets.value.splice(index, 1);
  saveToLocalStorage();
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

const formattedTime = computed(() => formatTime(time.value));

// when page loads, attempts to fetch saved sets from storage. If successful, use these sets
onMounted(() => {
  const savedSets = localStorage.getItem('sets');
  if (savedSets) {
    sets.value = JSON.parse(savedSets);
  }
});
</script>
