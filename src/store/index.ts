import { createContext, useContext } from 'react';

import MaterialStore from './Material';

interface Store {
  material: MaterialStore;
}

export const material = new MaterialStore();

const storeContext = createContext<Store>({
  material,
});

export function useStores() {
  return useContext(storeContext);
}
