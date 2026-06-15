import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'enquiries';

export const submitEnquiry = async (enquiryData) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...enquiryData,
    status: 'pending',
    createdAt: new Date().toISOString()
  });
};

export const getEnquiries = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToEnquiries = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const enquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(enquiries);
  }, (error) => {
    console.error("Error fetching enquiries:", error);
    callback([]);
  });
};

export const updateEnquiryStatus = async (id, status) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await updateDoc(docRef, { status });
};

export const deleteEnquiry = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};
