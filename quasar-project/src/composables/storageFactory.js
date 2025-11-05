import { useLocalStorage } from './useLocalStorage';
import { useAPI } from './useAPI';

export function useStorageFactory() {
  // uncomment whichever storage option to use, comment all others
  return useLocalStorage();
  // return useAPI();
}
