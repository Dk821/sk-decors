import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'bookings';

export const subscribeToBookings = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('eventDate', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(bookings);
  }, (error) => {
    console.error("Error fetching bookings:", error);
    callback([]);
  });
};

export const getBookings = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('eventDate', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addBooking = async (bookingData) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...bookingData,
    createdAt: new Date().toISOString()
  });
};

export const updateBooking = async (id, bookingData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, bookingData);
};

export const deleteBooking = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};
