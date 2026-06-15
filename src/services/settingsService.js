import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const SETTINGS_DOC_ID = 'global_settings';

export const defaultSettings = {
  businessName: 'SK Decor & Event Planner',
  phone1: '+91 93603 77726',
  phone2: '+91 63827 90842',
  email: 'skdecor1117@gmail.com',
  address: 'Gobichettipalayam, Erode - 638476',
  whatsapp: '919360377726'
};

export const subscribeToSettings = (callback) => {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(defaultSettings);
    }
  }, (error) => {
    console.error("Error fetching settings:", error);
    callback(defaultSettings);
  });
};

export const getSettings = async () => {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return defaultSettings;
};

export const updateSettings = async (settingsData) => {
  const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
  return await setDoc(docRef, settingsData, { merge: true });
};
