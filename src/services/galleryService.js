import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

const COLLECTION_NAME = 'gallery';

export const subscribeToGallery = (callback) => {
  return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
    const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(images);
  }, (error) => {
    console.error("Error fetching gallery:", error);
    callback([]);
  });
};

export const getGalleryImages = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const uploadGalleryImage = async (file, title, category) => {
  // Upload file to storage
  const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  // Add doc to firestore
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    title,
    category,
    img: downloadURL,
    storagePath: snapshot.ref.fullPath,
    createdAt: new Date().toISOString()
  });

  return { id: docRef.id, title, category, img: downloadURL };
};

export const deleteGalleryImage = async (id, storagePath) => {
  // Delete from storage
  if (storagePath) {
    const storageRef = ref(storage, storagePath);
    try {
      await deleteObject(storageRef);
    } catch(err) {
      console.warn("Storage deletion error, continuing with DB delete", err);
    }
  }

  // Delete from firestore
  const docRef = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(docRef);
};
