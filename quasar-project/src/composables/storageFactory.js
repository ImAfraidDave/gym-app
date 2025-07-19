import { useLocalStorage } from './useLocalStorage';

export function useStorageFactory() {
  // uncomment whichever storage option to use, comment all others
  return useLocalStorage();
}
