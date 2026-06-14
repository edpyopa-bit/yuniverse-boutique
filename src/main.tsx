import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initMockBackend } from './mockBackend.ts';

// Initialize mock backend for static environments (e.g., Netlify, GitHub Pages) fallback
initMockBackend();

// Prevent benign sandbox/websocket connection errors from bubbling up and crashing or showing overlays
if (typeof window !== 'undefined') {
  const ignorePatterns = ['WebSocket', 'vite', 'HMR', 'websocket'];
  
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = event.reason?.message || event.reason?.toString() || '';
    if (ignorePatterns.some(pattern => reasonStr.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const errorStr = event.message || '';
    if (ignorePatterns.some(pattern => errorStr.toLowerCase().includes(pattern.toLowerCase()))) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

