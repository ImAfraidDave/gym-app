<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <q-btn label="Finish Workout" @click="stopWorkout" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <q-input v-model="exerciseName" type="text" label="Exercise" />
    <q-btn label="Add" @click="addExercise(exerciseName)" />
    <p>Timer: {{ formattedTime }}</p>
    <q-card> Exercise Name </q-card>
    <q-card-section>
      <div v-for="exercise in exercises" v-bind:key="exercise.name">
        <p>{{ exercise.name }}</p>
        <div v-for="(set, index) in exercise.sets" v-bind:key="index">
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
          <q-btn :icon="matDelete" label="Remove Set" @click="removeSet(exercise, index)" stack />
        </div>
        <q-btn :icon="matAdd" label="New Set" @click="addSet(exercise)" stack />
      </div>
    </q-card-section>
  </q-page>
</template>

<script setup>
import { matDelete, matAdd } from '@quasar/extras/material-icons';

import { ref, computed, onMounted } from 'vue';

const time = ref(0);
const exerciseName = ref('');
const exercises = ref([]); // the exercises of the current workout.
const interval = ref(null);

const startTimer = () => {
  if (interval.value) clearInterval(interval.value);

  interval.value = setInterval(() => {
    time.value += 1;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval.value);
};

const startWorkout = () => {
  startTimer();
  exercises.value = []; // as a new workout is started, discard the current exercises from the previous workout
};

const stopWorkout = () => {
  stopTimer();
  // const currWorkout = {
  //   date: new Date().toLocaleString(),
  //   duration: time.value,
  //   exercises: exercises.value,
  // };
  // localStorage.setItem('workouts', JSON.stringify(currWorkout));
  // add currWorkout to list of previous workouts

  // reset time and exercises to prepare for the next workout
  exercises.value = [];
  time.value = 0;
};

const saveToLocalStorage = () => {
  localStorage.setItem('exercises', JSON.stringify(exercises.value));
};

// if there are saved sets in localStorage, use those, otherwise start with 1 blank set
// const sets = ref(JSON.parse(localStorage.getItem('exercises')) || [{}]);

const addExercise = () => {
  exercises.value.push({ name: exerciseName.value, sets: [] });
  exerciseName.value = '';
  saveToLocalStorage();
};

const addSet = (exercise) => {
  exercise.sets.push({ repCount: '', weight: '' });
  saveToLocalStorage();
};

const removeSet = (exercise, index) => {
  exercise.sets.splice(index, 1);
  saveToLocalStorage();
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

// when page loads, attempts to fetch saved sets from storage. If successful, use these sets
onMounted(() => {
  const savedExercises = localStorage.getItem('exercises');
  if (savedExercises) {
    exercises.value = JSON.parse(savedExercises);
  }
});
</script>
