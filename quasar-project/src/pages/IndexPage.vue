<template>
  <q-page class="flex flex-center">
    <q-btn color="primary" label="Start Empty Workout" @click="startWorkout" />
    <label>Routines</label>
    <q-btn color="primary" label="History" />
    <q-btn color="primary" label="Progress" />
    <q-btn label="Start Timer" @click="startTimer" />
    <q-btn label="Stop Timer" @click="stopTimer" />
    <p>Timer: {{ formattedTime }}</p>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

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

function formatTimeUnit(unit) {
  return unit < 10 ? '0' + unit : unit // if number is less than 10, add a leading 0
}

const startWorkout = () => {
  startTimer()
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`
}

const formattedTime = computed(() => formatTime(time.value))
</script>
