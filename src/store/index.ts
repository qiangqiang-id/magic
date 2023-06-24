import { createContext, useContext } from 'react';

import MaterialStore from './Material';
import OSStore from './OS';

interface Store {
  material: MaterialStore;
  OS: OSStore;
}

export const material = new MaterialStore();
export const OS = new OSStore();

const storeContext = createContext<Store>({
  material,
  OS,
});

export function useStores() {
  return useContext(storeContext);
}
