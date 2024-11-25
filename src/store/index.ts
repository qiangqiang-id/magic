import { createContext, useContext } from 'react';

import MaterialStore from './Material';
import OSStore from './OS';
import MagicStore from './Magic';
import HistoryStore from './History';
import FontStore from './Font';

export interface Stores {
  material: MaterialStore;
  OS: OSStore;
  magic: MagicStore;
  history: HistoryStore;
  font: FontStore;
}

export const material = new MaterialStore();
export const OS = new OSStore();
export const magic = new MagicStore();
export const history = new HistoryStore();
export const font = new FontStore();

const storeContext = createContext<Stores>({
  material,
  OS,
  magic,
  history,
  font,
});

export function useStores() {
  return useContext(storeContext);
}
