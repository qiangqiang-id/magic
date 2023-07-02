import { useEffect } from 'react';
import Layout from './layout';
import KeyboardManager from './core/Manager/Keyboard';
import {
  registerAppActions,
  registerOSSActions,
  registerHistoryActions,
} from './core/Manager/Cmd';
import { useStores } from '@/store';
import './App.css';
import './utils/logo';

function App() {
  const { OS, magic } = useStores();
  const registerInfo = () => {
    registerAppActions(magic);
    registerOSSActions(OS);
    registerHistoryActions();
  };
  useEffect(() => {
    registerInfo();
  }, []);
  return (
    <>
      <Layout />;
      <KeyboardManager />
    </>
  );
}

export default App;
