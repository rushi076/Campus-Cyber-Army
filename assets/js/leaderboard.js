import { auth, db } from "./firebase-config.js";

import {
collection,
query,
where,
orderBy,
limit,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const tbody =
document.getElementById("leaderboard-body");

const title =
document.getElementById("leaderboard-title");



window.showLeaderboard =
async function(type){

tbody.innerHTML = "";


if(type === "college"){

const user = auth.currentUser;

if(!user) return;

const userDoc =
await getDoc(doc(db,"users",user.uid));

const userCollege =
userDoc.data().college;


title.textContent =
`🎓 ${userCollege} Leaderboard`;


const q =
query(
collection(db,"users"),
where("college","==",userCollege),
orderBy("totalPoints","desc")
);


const snapshot =
await getDocs(q);


let count = 1;

snapshot.forEach(doc => {

const data =
doc.data();

tbody.innerHTML +=

`<tr>
<td>${count++}</td>
<td>${data.name}</td>
<td>${data.totalPoints || 0}</td>
</tr>`;

});

}


else{

title.textContent =
"🌍 Cyber Army Global Leaderboard";


const q =
query(
collection(db,"users"),
orderBy("totalPoints","desc"),
limit(50)
);


const snapshot =
await getDocs(q);


let count = 1;

snapshot.forEach(doc => {

const data =
doc.data();

tbody.innerHTML +=

`<tr>
<td>${count++}</td>
<td>${data.name}</td>
<td>${data.totalPoints || 0}</td>
</tr>`;

});

}

};



auth.onAuthStateChanged(user=>{

if(user){

showLeaderboard("college");

}

else{

window.location.href =
"login.html";

}

});