import { auth, db } from "./firebase-config.js";

import { 
createUserWithEmailAndPassword,
sendEmailVerification,
signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


window.registerUser = async function(){

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;
const college = document.getElementById("college").value.trim();

if(!name || !email || !password || !college){

alert("Please fill all fields");
return;

}

try{

const userCredential =
await createUserWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

await sendEmailVerification(user);

alert("📩 Verification email sent");

await setDoc(doc(db,"users",user.uid),{

name,
email,
college,
totalPoints:0,
weeklyPoints:0,
joinedDate:serverTimestamp()

});

await signOut(auth);

window.location.href="login.html";

}catch(error){

alert("❌ " + error.message);

}

};