import { ref } from 'vue';
import { Notify } from 'quasar';
import { useSound } from '@vueuse/sound';
import dingSound from '../assets/sounds/bell_sound.wav';

export function useRestTimer(restDuration = 90) {
  const timerFinishSound = useSound(dingSound, { volume: 0.25 });
  const restTime = ref(0);
  const startTime = ref(0);
  const endTime = ref(0);
  const restInterval = ref(null);

  function startRestTimer(duration = restDuration) {
    stopRestTimer(); // if there is currently a running rest timer, stop it
    startTime.value = Date.now();
    endTime.value = startTime.value + duration * 1000;

    restInterval.value = setInterval(() => {
      const timeLeft = Math.ceil((endTime.value - Date.now()) / 1000);
      if (timeLeft > 0) {
        restTime.value = timeLeft;
      } else {
        stopRestTimer();

        timerFinishSound.play();

        Notify.create({
          message: 'Rest is over!',
          color: 'green',
          position: 'top',
          timeout: 3000,
        });
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

  function addRestTime(extraSeconds: number) {
    endTime.value += extraSeconds * 1000;
  }

  function subtractRestTime(extraSeconds: number) {
    endTime.value = endTime.value - extraSeconds * 1000;
  }

  return {
    restTime,
    startRestTimer,
    stopRestTimer,
    addRestTime,
    subtractRestTime,
  };
}
