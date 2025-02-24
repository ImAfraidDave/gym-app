<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <label>Routines</label>
    <q-btn color="primary" label="History" />
    <q-btn color="primary" label="Progress" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <p>Timer: {{ time }}</p>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const time = ref(0)
let interval

const startTimer = () => {
  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    time.value += 1
  }, 1000)
}

const stopTimer = () => {
  clearInterval(interval)
}

const startWorkout = () => {
  startTimer()
}
</script>
