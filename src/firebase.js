// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA8f87OOj8eB4dinhfxNmtrbDqL8cPidlU",
  authDomain: "clone-903bd.firebaseapp.com",
  projectId: "clone-903bd",
  storageBucket: "clone-903bd.appspot.com",
  messagingSenderId: "430461735910",
  appId: "1:430461735910:web:e11eac59a20002c608bc27",
  measurementId: "G-3LMMTYFW3P",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
export { db, auth, storage };
