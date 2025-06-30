// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔐 Copia os dados do teu firebaseConfig.js da app Sintra 360
const firebaseConfig = {
    apiKey: "AIzaSyCZXyqmf3rqhL10Nq2aMhDgIItqkRKI4Bg",
    authDomain: "sintra-360.firebaseapp.com",
    projectId: "sintra-360",
    storageBucket: "sintra-360.firebasestorage.app",
    messagingSenderId: "262715639245",
    appId: "1:262715639245:web:269afca44bbeeaf68c3084",
    measurementId: "G-BXYZ9MXTZJ"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
