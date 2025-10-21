import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { sendToVercelAnalytics } from './vitals';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import firebaseApp, { getAnalyticsInstance } from './services/firebase';

if (process.env.NODE_ENV !== 'production' && firebaseApp) {
  Object.freeze(firebaseApp);
}

if (firebaseApp) {
  getAnalyticsInstance().catch((error) => {
    console.warn('Analytics is not supported in this environment.', error);
  });
}

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App></App>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals(sendToVercelAnalytics);
