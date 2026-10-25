import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC0SNSJ85nHh3mbBabAb9DHJPhc8FHavQA',
  authDomain: 'freshfield-app-a91b3.firebaseapp.com',
  projectId: 'freshfield-app-a91b3',
  storageBucket: 'freshfield-app-a91b3.firebasestorage.app',
  messagingSenderId: '615588826946',
  appId: '1:615588826946:web:9ded09303cdfe6f08d02db',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
