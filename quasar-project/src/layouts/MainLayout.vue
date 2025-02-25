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
        <q-btn icon="quasar" stack>Home</q-btn>
        <q-btn>History</q-btn>
        <q-btn>Workout</q-btn>
        <q-btn>Progress</q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
