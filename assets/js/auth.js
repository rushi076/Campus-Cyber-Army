import { auth } from "./firebase-config.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


window.togglePassword = function () {

const passwordInput = document.getElementById("password");

passwordInput.type =
passwordInput.type === "password"
? "text"
: "password";

};


window.loginUser = async function () {

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

try {

const userCredential =
await signInWithEmailAndPassword(auth,email,password);

const user = userCredential.user;


// Admin Bypass

if(user.email !== "kuchnaya@kuchnaya.in" && !user.emailVerified){

alert("⚠️ Please verify your email before logging in.");

return;

}

alert("✅ Login successful!");

setTimeout(()=>{

if(user.email === "kuchnaya@kuchnaya.in"){

window.location.href = "admin.html";

}else{

window.location.href = "dashboard.html";

}

},1000);

}catch(error){

alert("❌ Error: " + error.message);

}

};