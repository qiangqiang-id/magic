import { createContext, useContext } from 'react';

import MaterialStore from './Material';
import OSStore from './OS';
import MagicStore from './Magic';

interface Store {
  material: MaterialStore;
  OS: OSStore;
  magic: MagicStore;
}

export const material = new MaterialStore();
export const OS = new OSStore();
export const magic = new MagicStore();

const storeContext = createContext<Store>({
  material,
  OS,
  magic,
});

export function useStores() {
  return useContext(storeContext);
}
