
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCUFAgDtjxWdbiVHr4qL9VKKewoWkyzQk0",
authDomain: "campus-cyber-army-a1b24.firebaseapp.com",
projectId: "campus-cyber-army-a1b24",
storageBucket: "campus-cyber-army-a1b24.appspot.com",
messagingSenderId: "602096130911",
appId: "1:602096130911:web:1dbc47922cec7152fc74ea",
measurementId: "G-TGWJYCL6LC"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };