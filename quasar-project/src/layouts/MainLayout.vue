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
        <q-tabs shrink stretch>
          <q-route-tab :icon="matHome" to="/">Home</q-route-tab>
          <q-route-tab :icon="matCalendarMonth" to="/history">History</q-route-tab>
          <q-route-tab :icon="matFitnessCenter" to="/workout">Workout</q-route-tab>
          <q-route-tab :icon="matTrendingUp" to="/progress">Progress</q-route-tab>
        </q-tabs>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script setup>
import {
  matHome,
  matCalendarMonth,
  matFitnessCenter,
  matTrendingUp,
} from '@quasar/extras/material-icons';
</script>
