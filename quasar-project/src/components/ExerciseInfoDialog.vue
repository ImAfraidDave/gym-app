<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">{{ exercise.name }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="scroll">
        <p>Target Muscles: {{ exercise.targetMuscles.join(', ') }}</p>
        <p>Secondary Muscles: {{ exercise.secondaryMuscles.join(', ') }}</p>
        <p>Equipment: {{ exercise.equipments.join(', ') }}</p>
        <q-separator />
        <ul>
          <li v-for="(step, idx) in exercise.instructions" v-bind:key="idx">
            {{ step }}
          </li>
        </ul>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Close" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from 'quasar';

defineProps({
  exercise: Object,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide } = useDialogPluginComponent();

function close() {
  dialogRef.value?.hide();
}
</script>
