import { useEffect } from 'react';
import Layout from './layout';
import KeyboardManager from './core/Manager/Keyboard';
import HistoryManager from './core/Manager/History';
import {
  registerAppActions,
  registerOSSActions,
  registerHistoryActions,
} from './core/Manager/Cmd';
import { useStores } from '@/store';
import './utils/logo';

function App() {
  const { OS, magic, history } = useStores();

  const registerInfo = () => {
    HistoryManager.register(history);

    registerAppActions(magic);
    registerOSSActions(OS);
    registerHistoryActions();
  };

  useEffect(() => {
    registerInfo();
  }, []);
  return (
    <>
      <Layout />
      <KeyboardManager />
    </>
  );
}

export default App;
