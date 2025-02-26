<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <q-btn label="Finish Workout" @click="stopWorkout" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <q-input v-model="repCount" type="number" label="Rep" id="repCountTxt" />
    <q-input v-model="weight" type="number" label="Weight (kg)" id="weightTxt" />
    <q-btn label="Add Exercise" @click="addExercise" />
    <p>Timer: {{ formattedTime }}</p>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';

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

let exerciseNumber = 0;

const startWorkout = () => {
  startTimer();
  exerciseNumber = 0;
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
const repCount = ref(null);
const weight = ref(null);

/**
 * Adds an exercise to the current workout.
 */
const addExercise = () => {
  var exercise = {};
  // exercise.name = // get the exercise name
  exercise.reps = repCount.value;
  exercise.weight = weight.value;
  exercise.number = exerciseNumber++; // keeps track of order of exercises
  exercises.push(exercise);
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
}

const formattedTime = computed(() => formatTime(time.value));
</script>
