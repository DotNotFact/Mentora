import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@app/provider';
import { App } from './App';
import '@/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
