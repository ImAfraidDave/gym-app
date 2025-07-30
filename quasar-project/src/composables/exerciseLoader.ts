import exercises from '../data/exercises.json';

const exerciseMap = Object.fromEntries(exercises.map((e) => [e.exerciseId, e]));

export function getExercisesFromList() {
  return {
    exercises,
  };
}

export function getExerciseById(exerciseId) {
  return exerciseMap[exerciseId];
}
