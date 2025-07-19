export function useLocalStorage() {
  const loadExercises = () => {
    return JSON.parse(localStorage.getItem('exercises')) || [];
  };

  const saveExercises = (exercises) => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  };

  const loadActiveWorkout = () => {
    return JSON.parse(localStorage.getItem('activeWorkout')) || false;
  };

  const saveActiveWorkout = (state) => {
    localStorage.setItem('activeWorkout', JSON.stringify(state));
  };

  const loadStartTime = () => {
    return Number(localStorage.getItem('exercises')) || null;
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
