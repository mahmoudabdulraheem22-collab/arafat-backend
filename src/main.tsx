import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, preloadEssentialOfflineData } from './utils/offlineStorage.ts';

// Register service worker and initialize offline prayers & map dataset
registerServiceWorker();
preloadEssentialOfflineData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
