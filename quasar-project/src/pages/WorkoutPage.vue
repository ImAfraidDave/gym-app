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
        <q-btn
          :icon="matAdd"
          label="Add Exercise"
          @click="selectExercise = true"
          v-if="activeWorkout"
        />
        <q-dialog v-model="selectExercise">
          <q-card>
            <q-card-section>
              <div class="text-h6">Add Exercise</div>
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-list bordered>
                <q-item
                  v-for="exercise in exerciseList"
                  v-bind:key="exercise.exerciseId"
                  clickable
                  @click="toggleSelection(exercise)"
                  :active="isSelected(exercise)"
                >
                  <q-item-section avatar top>
                    <q-checkbox v-model="selectedExercises" :val="exercise"></q-checkbox>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ exercise.name }}</q-item-label>
                    <q-item-label caption>{{ exercise.bodyParts.join(', ') }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn label="Add Selected" v-close-popup @click="addSelectedExercises"> </q-btn>
              <q-btn label="Cancel" v-close-popup @click="clearSelectedExercises"> </q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
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
import { useStorageFactory } from 'src/composables/storageFactory';

const storage = useStorageFactory();

const {
  loadExercises,
  saveExercises,
  loadActiveWorkout,
  saveActiveWorkout,
  loadStartTime,
  saveStartTime,
  saveHistoricWorkout,
} = storage;

import exerciseList from '../data/exercises.json';

const selectExercise = ref(false);
const exercises = ref([]);
const time = ref(0);
const interval = ref(null);

let startTime = ref(null);
let activeWorkout = ref(false);

let selectedExercises = ref([]); // collection of what exercises to add to the workout
function toggleSelection(exercise) {
  const index = selectedExercises.value.findIndex((e) => e.exerciseId === exercise.exerciseId);
  if (index === -1) {
    selectedExercises.value.push(exercise);
  } else {
    selectedExercises.value.splice(index, 1);
  }
}

function isSelected(exercise) {
  return selectedExercises.value.some((e) => e.exerciseId === exercise.exerciseId);
}

function clearSelectedExercises() {
  selectedExercises.value = [];
}

function addSelectedExercises() {
  for (const exercise of selectedExercises.value) {
    addExercise(exercise.name);
  }
  clearSelectedExercises();
}

const addExercise = (name) => {
  if (!name.trim()) return; // Prevent adding empty exercises

  const exercise = {
    exerciseName: name.trim(),
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

  exercises.value = [];
  activeWorkout.value = true;

  saveExercises(exercises.value);
  saveStartTime(startTime.value);
  saveActiveWorkout(true);
};

const stopWorkout = () => {
  stopTimer();

  const workout = {
    dateTime: startTime.value,
    duration: Math.round(time.value / 60),
    exercises: exercises.value,
  };

  saveHistoricWorkout(workout);
  activeWorkout.value = false;
  saveActiveWorkout(false);
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
  exercises.value = loadExercises();
  const savedStart = loadStartTime();

  if (savedStart) {
    startTime.value = savedStart;
    time.value = Math.floor((Date.now() - startTime.value) / 1000);
  }

  if (loadActiveWorkout()) {
    activeWorkout.value = true;
    startTimer();
  }
});
</script>
