import { debounce } from "lodash"

export function useLocalStorage() {
  const loadExercises = () => {
    const savedExercises = localStorage.getItem('exercises');
    if (!savedExercises) return [];
    try {
      return JSON.parse(savedExercises);
    } catch {
      return [];
    }
  };

  // save exercises to local storage. Debounced so multiple changes in a short timeframe won't result in multiple calls
  const saveExercises = debounce((exercises) => {
      localStorage.setItem('exercises', JSON.stringify(exercises.value))
  }, 300)

  const loadActiveWorkout = () => {
    return JSON.parse(localStorage.getItem('activeWorkout')) || false;
  };

  const saveActiveWorkout = (state) => {
    localStorage.setItem('activeWorkout', JSON.stringify(state));
  };

  const loadStartTime = () => {
    return Number(localStorage.getItem('startTime')) || null;
  };

  const saveStartTime = (time) => {
    localStorage.setItem('startTime', time);
  };

  const saveHistoricWorkout = (workout) => {
    const historicWorkouts = JSON.parse(localStorage.getItem('historicWorkouts')) || [];
    historicWorkouts.push(workout);
    localStorage.setItem('historicWorkouts', JSON.stringify(historicWorkouts));
  };

  return {
    loadExercises,
    saveExercises,
    loadActiveWorkout,
    saveActiveWorkout,
    loadStartTime,
    saveStartTime,
    saveHistoricWorkout,
  };
}
