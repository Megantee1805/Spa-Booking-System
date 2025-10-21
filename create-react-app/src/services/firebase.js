import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT,
};

const validateConfig = (config) => {
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length) {
    console.warn(
      `Firebase configuration is incomplete. Missing keys: ${missingKeys.join(', ')}`
    );
  }
};

validateConfig(firebaseConfig);

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const hasRequiredConfig = requiredKeys.every((key) => Boolean(firebaseConfig[key]));

const firebaseApp = hasRequiredConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : undefined;

let analyticsInstance;

export const getAnalyticsInstance = async () => {
  if (analyticsInstance || !firebaseApp) {
    return analyticsInstance;
  }

  if (typeof window === 'undefined') {
    return undefined;
  }

  if (await isSupported()) {
    analyticsInstance = getAnalytics(firebaseApp);
    return analyticsInstance;
  }

  return undefined;
};

export const firestore = firebaseApp ? getFirestore(firebaseApp) : undefined;
export const realtimeDb = firebaseApp ? getDatabase(firebaseApp) : undefined;
export default firebaseApp;
