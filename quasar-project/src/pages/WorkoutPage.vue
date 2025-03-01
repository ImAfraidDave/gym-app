<template>
  <q-page class="flex flex-center">
    <q-card>
      <section class="workoutOptions">
        <q-btn label="Finish Workout" v-if="activeWorkout" @click="stopWorkout" />
        <q-btn
          color="primary"
          label="Start Empty Workout"
          v-if="!activeWorkout"
          @click="startWorkout"
        />
        <q-input v-model="exerciseName" type="text" label="Exercise" />
        <q-btn :icon="matAdd" label="Add Exercise" @click="addExercise(exerciseName)" />
        <p>Timer: {{ formattedTime }}</p>
      </section>
      <section class="workoutSection">
        <div v-for="(exercise, id) in exercises" v-bind:key="id">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ exercise.exerciseName }}</div>
            </q-card-section>
            <q-separator />
            <div v-for="(set, index) in exercise.sets" v-bind:key="index">
              <q-card-actions vertical>
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
              </q-card-actions>
              <q-btn :icon="matDelete" @click="deleteSet(exercise, index)" />
            </div>
            <q-btn :icon="matAdd" label="Add Set" @click="addSet(exercise)" />
            <q-btn :icon="matDelete" label="Delete Exercise" @click="deleteExercise(id)" />
          </q-card>
        </div>
      </section>
    </q-card>
  </q-page>
</template>

<script setup>
import { matDelete, matAdd } from '@quasar/extras/material-icons';

import { ref, computed, onMounted } from 'vue';

const exercises = ref([]);
const time = ref(0);
const interval = ref(null);
const exerciseName = ref('');

let startTime = null;
let activeWorkout = ref(false);

const addExercise = (exerciseName) => {
  const exercise = {
    exerciseName: exerciseName,
    sets: [],
  };

  exercises.value.push(exercise);
  addSet(exercise);
};

const deleteExercise = (id) => {
  exercises.value.splice(id, 1);
  saveToLocalStorage();
};

const addSet = (exercise) => {
  exercise.sets.push({ reps: '', weight: '' });
  saveToLocalStorage();
};

const deleteSet = (exercise, index) => {
  exercise.sets.splice(index, 1);
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem('exercises', JSON.stringify(exercises.value));
};

const startWorkout = () => {
  startTimer();
  time.value = 0;
  startTime = Date.now();
  exercises.value = []; // as a new workout is started, discard the current exercises from the previous workout
  activeWorkout.value = true;
  localStorage.setItem('exercises', JSON.stringify(exercises.value));
  localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout.value));
  localStorage.setItem('startTime', JSON.stringify(startTime));
};

const stopWorkout = () => {
  stopTimer();

  // const workout = {
  //   date: new Date().toLocaleString(),
  //   duration: time.value,
  //   exercises: exercises.value,
  // };

  // let previousWorkouts = localStorage.getItem('previousWorkouts');
  // // if historic data exists, use it, otherwise create blank array to use
  // previousWorkouts = previousWorkouts ? JSON.parse(previousWorkouts) : [];
  // previousWorkouts.push(workout);
  // localStorage.setItem('previousWorkouts', JSON.stringify(previousWorkouts));

  // let previousSets = localStorage.getItem('previousSets');
  // // if historic data exists, use it, otherwise create blank array to use
  // previousSets = previousSets ? JSON.parse(previousSets) : [];
  // // pushes with spread, this means that the arrays are combined
  // previousSets.push(...sets);
  // localStorage.setItem('previousSets', JSON.stringify(previousSets));

  // time.value = 0;
  // exercises.value = [];
  // duration = Date.now() - startTime;
  activeWorkout.value = false;
  localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout.value));
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
  const savedExercises = localStorage.getItem('exercises');
  if (savedExercises) {
    exercises.value = JSON.parse(savedExercises);
  }
  const savedStartTime = localStorage.getItem('startTime');
  if (savedStartTime) {
    time.value = Math.floor((Date.now() - Number(savedStartTime)) / 1000);
  }
  const savedActiveWorkout = localStorage.getItem('activeWorkout');
  if (savedActiveWorkout && JSON.parse(savedActiveWorkout)) {
    activeWorkout.value = true;
    startTimer();
  }
});
</script>
