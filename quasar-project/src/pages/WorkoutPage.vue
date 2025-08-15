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

        <q-dialog v-model="selectExercise" transition-show="none" transition-hide="none">
          <q-card>
            <q-card-section>
              <div class="text-h6">Add Exercise</div>
              <q-input v-model="exerciseNameFilter" type="text" debounce="300" label="Search" />
              <q-select
                v-model="musclesWorkedFilter"
                :options="muscleOptions"
                label="Muscles Worked"
                clearable
              />
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-list bordered>
                <q-virtual-scroll :items="filteredExerciseList" :item-size="50" separator>
                  <template v-slot="{ item: exercise }">
                    <q-item
                      :key="exercise.exerciseId"
                      clickable
                      @click="toggleSelection(exercise)"
                      :active="selectedSet.has(exercise.exerciseId)"
                    >
                      <q-item-section>
                        <q-item-label>{{ exercise.name }}</q-item-label>
                        <q-item-label caption>{{ exercise.bodyParts.join(', ') }}</q-item-label>
                      </q-item-section>
                      <q-item-section>
                        <q-btn @click.stop="showExerciseInfoDialog(exercise)" label="?" />
                      </q-item-section>
                    </q-item>
                  </template>
                </q-virtual-scroll>
              </q-list>
            </q-card-section>
            <q-separator />
            <q-card-actions>
              <q-btn
                label="Add Selected"
                v-close-popup
                @click="addSelectedExercises"
                :disable="selectedExercises.length === 0"
              />
              <q-btn label="Cancel" v-close-popup @click="clearSelectedExercises" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <p v-if="activeWorkout">Timer: {{ formattedTime }}</p>
      </section>
      <section class="workoutSection" v-if="activeWorkout">
        <div v-for="(exercise, id) in exercises" :key="exercise.exerciseId">
          <q-card>
            <q-card-section>
              <div class="text-h6 row items-center justify-between">
                <span>{{ exercise.name }}</span>
                <q-btn
                  @click.stop="showExerciseInfoDialog(getExerciseById(exercise.exerciseId))"
                  label="?"
                  round
                  dense
                />
              </div>
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
              />
              <q-input
                v-model="set.weight"
                type="number"
                label="Weight (kg)"
                min="0"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useStorageFactory } from 'src/composables/storageFactory';
import { Dialog } from 'quasar';
import ExerciseInfoDialog from 'src/components/ExerciseInfoDialog.vue';
import exerciseData from 'src/data/exercises.json';
import muscleOptions from 'src/data/muscleOptions.json';
import { getExerciseById } from 'src/composables/exerciseLoader';

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

const selectExercise = ref(false);
const exercises = ref([]);
const time = ref(0);
const interval = ref(null);

let startTime = ref(null);
let activeWorkout = ref(false);

function showExerciseInfoDialog(exercise) {
  Dialog.create({
    component: ExerciseInfoDialog,
    componentProps: {
      exercise,
    },
  });
}

const exerciseNameFilter = ref('');
const musclesWorkedFilter = ref('');
const exerciseList = ref(exerciseData);
// Case-insensitive check exercises match filter
function filterByName(exercise, filter) {
  const name = exercise.name.toLowerCase();
  return name.includes(filter);
}
function filterByMusclesWorked(exercise, filter) {
  const bodyParts = exercise.bodyParts.join(', ').toLowerCase();
  return bodyParts.includes(filter);
}
// filter the exercises based on search input
const filteredExerciseList = computed(() => {
  const nameFilter = exerciseNameFilter.value.trim().toLowerCase();
  // if no option is selected for the muscle filter, apply an empty filter
  const musclesFilter = musclesWorkedFilter.value
    ? musclesWorkedFilter.value.trim().toLowerCase()
    : '';

  return exerciseList.value
    .filter((ex) => !nameFilter || filterByName(ex, nameFilter))
    .filter((ex) => !musclesFilter || filterByMusclesWorked(ex, musclesFilter));
});

let selectedExercises = ref([]); // collection of what exercises to add to the workout
const selectedSet = computed(() => {
  return new Set(selectedExercises.value.map((e) => e.exerciseId));
});

function toggleSelection(exercise) {
  const exists = selectedExercises.value.find((e) => e.exerciseId === exercise.exerciseId);
  if (exists) {
    selectedExercises.value = selectedExercises.value.filter(
      (e) => e.exerciseId !== exercise.exerciseId,
    );
  } else {
    selectedExercises.value.push(exercise);
  }
}

// unselect all exercises in the exercise selection dialog, and reset the search filters
function clearSelectedExercises() {
  selectedExercises.value = [];
  exerciseNameFilter.value = '';
  musclesWorkedFilter.value = '';
}

// add all exercises selected in the dialog modal to the workout
function addSelectedExercises() {
  for (const exercise of selectedExercises.value) {
    addExercise(exercise.exerciseId, exercise.name);
  }
  clearSelectedExercises(); // unselect the exercises after adding them
}

const addExercise = (exerciseId, name) => {
  if (!name.trim()) return; // Prevent adding empty exercises

  const exercise = {
    exerciseId,
    name: name.trim(),
    sets: [],
  };

  exercises.value.push(exercise);
  addSet(exercise);
};

const deleteExercise = (id) => {
  exercises.value.splice(id, 1);
};

const addSet = (exercise) => {
  exercise.sets.push({ reps: '', weight: '', completed: false });
};

const deleteSet = (exercise, index) => {
  exercise.sets.splice(index, 1);
};

// call saveExercises whenever any changes are made to the list of exercises
// and any nested attributes of exercises
watch(
  exercises,
  (newVal) => {
    saveExercises(newVal);
  },
  { deep: true } // watches for any changes to nested attributes too
)

const startWorkout = () => {
  startTimer();
  time.value = 0;
  startTime.value = Date.now();

  exercises.value = [];
  activeWorkout.value = true;

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
    time.value = Math.floor((Date.now() - startTime.value) / 1000);
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
