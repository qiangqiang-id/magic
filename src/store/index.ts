import { createContext, useContext } from 'react';

import MaterialStore from './Material';
import OSStore from './OS';
import MagicStore from './Magic';
import HistoryStore from './History';

interface Store {
  material: MaterialStore;
  OS: OSStore;
  magic: MagicStore;
  history: HistoryStore;
}

export const material = new MaterialStore();
export const OS = new OSStore();
export const magic = new MagicStore();
export const history = new HistoryStore();

const storeContext = createContext<Store>({
  material,
  OS,
  magic,
  history,
});

export function useStores() {
  return useContext(storeContext);
}
