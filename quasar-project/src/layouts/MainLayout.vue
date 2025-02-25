<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar elevated class="bg-primary text-white">
        <q-toolbar-title> <q-avatar> </q-avatar> Gym Buddy</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-toolbar elevated class="bg-primary text-white">
        <q-btn :icon="matHome" stack>Home</q-btn>
        <q-btn :icon="matCalendarMonth" stack>History</q-btn>
        <q-btn :icon="matAdd" stack>Workout</q-btn>
        <q-btn :icon="matTrendingUp" stack>Progress</q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script setup>
import { matHome, matCalendarMonth, matAdd, matTrendingUp } from '@quasar/extras/material-icons'
</script>
