<template>
  <q-page class="flex flex-center">
    <q-card>
      <section class="workoutOptions">
        <q-btn
          color="primary"
          label="Start Empty Workout"
          v-if="!activeWorkout"
          @click="startWorkout"
        />
        <q-input v-model="exerciseName" type="text" label="Exercise" v-if="activeWorkout" />
        <q-btn
          :icon="matAdd"
          label="Add Exercise"
          @click="addExercise(exerciseName)"
          v-if="activeWorkout"
        />
        <p v-if="activeWorkout">Timer: {{ formattedTime }}</p>
      </section>
      <section class="workoutSection" v-if="activeWorkout">
        <div v-for="(exercise, id) in exercises" v-bind:key="id">
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ exercise.exerciseName }}</div>
            </q-card-section>
            <q-separator />
            <q-card-actions
              v-for="(set, index) in exercise.sets"
              v-bind:key="index"
              horizontal
              :class="{ completed: set.completed, uncompleted: !set.completed }"
            >
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
              <q-checkbox v-model="set.completed" />
              <q-btn :icon="matDelete" @click="deleteSet(exercise, index)" />
            </q-card-actions>
            <q-btn :icon="matAdd" label="Add Set" @click="addSet(exercise)" />
            <q-btn :icon="matDelete" label="Delete Exercise" @click="deleteExercise(id)" />
          </q-card>
        </div>
      </section>
      <q-btn label="Finish Workout" v-if="activeWorkout" @click="stopWorkout" />
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

let startTime = ref(null);
let activeWorkout = ref(false);

const addExercise = (name) => {
  if (!name.trim()) return; // Prevent adding empty exercises

  const exercise = {
    exerciseName: name.trim(),
    sets: [],
  };

  exercises.value.push(exercise);
  addSet(exercise);
  exerciseName.value = '';
};

const deleteExercise = (id) => {
  exercises.value.splice(id, 1);
  saveToLocalStorage();
};

const addSet = (exercise) => {
  exercise.sets.push({ reps: '', weight: '', completed: false });
  saveToLocalStorage();
};

const deleteSet = (exercise, index) => {
  exercise.sets.splice(index, 1);
  saveToLocalStorage();
};

// function toggleSetComplete(event, set) {
//   if (set.completed) {

//   }
// }

const saveToLocalStorage = () => {
  localStorage.setItem('exercises', JSON.stringify(exercises.value));
};

const startWorkout = () => {
  startTimer();
  time.value = 0;
  startTime.value = Date.now();
  exercises.value = []; // as a new workout is started, discard the current exercises from the previous workout
  activeWorkout.value = true;
  localStorage.setItem('exercises', JSON.stringify(exercises.value));
  saveToLocalStorage();
  localStorage.setItem('activeWorkout', JSON.stringify(activeWorkout.value));
  localStorage.setItem('startTime', startTime.value);
};

const stopWorkout = () => {
  stopTimer();

  const workout = {
    dateTime: startTime.value,
    duration: Math.round(time.value / 60),
    exercises: exercises.value,
  };

  let historicWorkouts = JSON.parse(localStorage.getItem('historicWorkouts')) || [];
  historicWorkouts.push(workout);
  localStorage.setItem('historicWorkouts', JSON.stringify(historicWorkouts));

  // let historicSets = localStorage.getItem('historicSets');
  // // if historic data exists, use it, otherwise create blank array to use
  // historicSets = historicSets ? JSON.parse(historicSets) : [];
  // // pushes with spread, this means that the arrays are combined
  // historicSets.push(...sets);
  // localStorage.setItem('historicSets', JSON.stringify(historicSets));

  // time.value = 0;
  // exercises.value = [];
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
    startTime.value = Number(savedStartTime);
    time.value = Math.floor((Date.now() - startTime.value) / 1000);
  }
  const savedActiveWorkout = localStorage.getItem('activeWorkout');
  if (savedActiveWorkout && JSON.parse(savedActiveWorkout)) {
    activeWorkout.value = true;
    startTimer();
  }
});
</script>
