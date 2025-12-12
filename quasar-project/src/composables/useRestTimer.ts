import { ref } from 'vue';

export function useRestTimer(restDuration = 90) {
  const restTime = ref(0);
  const startTime = ref(0);
  const restInterval = ref(null);

  function startRestTimer(duration = restDuration) {
    stopRestTimer(); // if there is currently a running rest timer, stop it
    startTime.value = Date.now();
    restTime.value = duration;

    restInterval.value = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.value) / 1000);
      const timeLeft = duration - elapsed;

      if (timeLeft > 0) {
        restTime.value = timeLeft;
      } else {
        stopRestTimer();
      }
    }, 1000);
  }

  function stopRestTimer() {
    if (restInterval.value) {
      clearInterval(restInterval.value);
      restInterval.value = null;
    }
    restTime.value = 0;
  }

  return {
    restTime,
    startRestTimer,
    stopRestTimer,
  };
}
