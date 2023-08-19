import { createContext, useContext } from 'react';

import MaterialStore from './Material';
import OSStore from './OS';
import MagicStore from './Magic';
import HistoryStore from './History';
import SettingStore from './Setting';

interface Store {
  material: MaterialStore;
  OS: OSStore;
  magic: MagicStore;
  history: HistoryStore;
  setting: SettingStore;
}

export const material = new MaterialStore();
export const OS = new OSStore();
export const magic = new MagicStore();
export const history = new HistoryStore();
export const setting = new SettingStore();

const storeContext = createContext<Store>({
  material,
  OS,
  magic,
  history,
  setting,
});

export function useStores() {
  return useContext(storeContext);
}
