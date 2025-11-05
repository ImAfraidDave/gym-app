import { debounce } from "lodash"
import { ref } from 'vue';
import Cookies from 'js-cookie';

const authState = ref({ loggedIn: false, user: null });

export function useAuth() {
  const setAuth = (user) => {
    authState.value = { loggedIn: true, user: user };
    Cookies.set('auth', JSON.stringify(authState.value), { path: '/', secure: true, expires: 1 });
  }

  const clearAuth = () => {
    authState.value = { loggedIn: false, user: null };
    Cookies.remove('auth');
  }

  const getAuth = () => {
    if (authState.value.loggedIn) return authState.value;
    // if page is refreshed, get auth from cookie
    const stored = Cookies.get('auth');
    if (stored) {
      authState.value = JSON.parse(stored);
      return authState.value;
    }
    return { loggedIn: false, user: null };
  }

  return { authState, setAuth, clearAuth, getAuth }
}

const auth = useAuth();

export async function signIn(email, password) {
  try {
    const response = await fetch(`/api/sign-in`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      auth.setAuth({ email: email });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Sign in failed:', err);
    return null;
  }
}

export async function register(first_name, surname, email, password) {
  try {
    const response = await fetch(`/api/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: first_name,
        surname: surname
      })
    });
    if (response.ok) {
      auth.setAuth({ email: email.value });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Register failed:', err);
    return null;
  }
}

export async function logout() {
  try {
    await fetch(`/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    auth.clearAuth();
  } catch (err) {
    console.error('Sign in failed:', err);
    return null;
  }
}

export function useAPI() {
  const { getAuth } = useAuth();

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
    localStorage.setItem('exercises', JSON.stringify(exercises))
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

  // when a workout is completed, pass it to the API which saves to the backend database
  async function saveHistoricWorkout(workout) {
    try {
      const auth = getAuth();
      const idToken = auth?.idToken;

      if (!idToken) throw new Error("User not authenticated");

      const response = await fetch('/api/save-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          user_id: auth.user_id,
          start_timestamp: workout.start_timestamp,
          end_timestamp: workout.end_timestamp,
          exercises: workout.exercises
        })
      });

      if (!response.ok) throw new Error('Failed to save workout');
    } catch (err) {
      console.error(err);
    }
  };

  async function fetchHistoricWorkouts() {
    try {
      const auth = getAuth();
      const idToken = auth?.idToken;

      if (!idToken) throw new Error("User not authenticated");

      const user_id = auth.user_id;

      const response = await fetch ('/api/get-workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id })
      });

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // get the database of exercises, used for exercise selection
  async function loadExerciseList() {
    try {
      const response = await fetch('/api/get-exercise-list');
      if (!response.ok) throw new Error('Failed to fetch exercises');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function getMuscleGroups() {
    try {
      const response = await fetch('/api/get-muscle-groups');
      if (!response.ok) throw new Error('Failed to fetch muscle groups');
      const data = await response.json();

      return data.map(item => item.name);
    } catch (err) {
      console.error(err);
    }
  }

  async function getExerciseById(id) {
    try {
      const response = await fetch(`/api/get-exercise/${id}`);
      if (!response.ok) throw new Error('Exercise not found');
      const exercise = await response.json();
      return exercise;
    } catch (err) {
      console.error(err);
      return null;
    }
  }



  return {
    loadExercises,
    saveExercises,
    loadActiveWorkout,
    saveActiveWorkout,
    loadStartTime,
    saveStartTime,
    saveHistoricWorkout,
    fetchHistoricWorkouts,
    loadExerciseList,
    getMuscleGroups,
    getExerciseById
  };
}
