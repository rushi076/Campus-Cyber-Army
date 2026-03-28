import { auth, db } from "./firebase-config.js";

import {
collection,
getDocs,
addDoc,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";



onAuthStateChanged(auth,(user)=>{

if(!user || user.email !== "kuchnaya@kuchnaya.in"){
window.location.href="../login.html";
}

else{
loadTasks();
loadLeaderboard();
loadStudents();
}

});



window.logout = function(){

signOut(auth).then(()=>{
window.location.href="login.html";
});

}



window.switchTab = function(id){

document.querySelectorAll(".section")
.forEach(sec=>{
sec.classList.remove("active");
});

document.getElementById(id)
.classList.add("active");


if(id==="tasks") loadTasks();

if(id==="students") loadStudents();

if(id==="leaderboard") loadLeaderboard();

}



window.openModal = function(){

document
.getElementById("task-modal")
.classList.add("active");

toggleOptionsField();

}



window.closeModal = function(){

document
.getElementById("task-modal")
.classList.remove("active");

}



window.toggleOptionsField = function(){

const type =
document.getElementById("task-type").value;

document
.getElementById("options-group")
.style.display =
type === "mcq" ? "block" : "none";

}



window.saveTask = async function(){

const name =
document.getElementById("task-name").value.trim();

const type =
document.getElementById("task-type").value;

const status =
document.getElementById("task-status").value;


let data = {

name,
type:type.toLowerCase(),
status,
createdAt: serverTimestamp()

};


if(type==="mcq"){

data.options={

A:document.getElementById("optionA").value.trim(),
B:document.getElementById("optionB").value.trim(),
C:document.getElementById("optionC").value.trim(),
D:document.getElementById("optionD").value.trim(),

correct:document
.getElementById("correctOption")
.value.trim()
.toUpperCase()

};

}


if(!name || !type || !status)
return alert("Fill all fields");


await addDoc(collection(db,"tasks"),data);

closeModal();
loadTasks();

}



async function loadTasks(){

const q = query(
collection(db,"tasks"),
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);

const tbody =
document.getElementById("task-table-body");

tbody.innerHTML="";


snapshot.forEach(docItem=>{

const task = docItem.data();

const row =

`<tr>

<td>${task.name}</td>
<td>${task.type}</td>
<td>${task.status}</td>

<td>

<button
class="btn btn-delete"
onclick="deleteTask('${docItem.id}')">

Delete

</button>

</td>

</tr>`;

tbody.innerHTML += row;

});

}



window.deleteTask = async function(id){

if(confirm("Delete task?")){

await deleteDoc(doc(db,"tasks",id));
loadTasks();

}

}



async function loadStudents(){

const snapshot =
await getDocs(collection(db,"users"));

const tbody =
document.getElementById("student-table-body");

tbody.innerHTML="";


snapshot.forEach(docItem=>{

const user = docItem.data();

const row =

`<tr>

<td>${user.name || "-"}</td>
<td>${user.email || "-"}</td>
<td>${user.college || "-"}</td>
<td>${user.points || 0}</td>

</tr>`;

tbody.innerHTML += row;

});

}



window.loadLeaderboard = async function(){

const filter =
document.getElementById("college-filter").value;


const q = query(
collection(db,"users"),
orderBy("points","desc")
);

const snapshot = await getDocs(q);

const tbody =
document.getElementById("leaderboard-table-body");

tbody.innerHTML="";


const colleges = new Set();


snapshot.forEach(docItem=>{

const user = docItem.data();

colleges.add(user.college);


if(filter==="All" || user.college===filter){

const row =

`<tr>

<td>${user.name || "-"}</td>
<td>${user.email || "-"}</td>
<td>${user.college || "-"}</td>
<td>${user.points || 0}</td>

</tr>`;

tbody.innerHTML += row;

}

});


const select =
document.getElementById("college-filter");


select.innerHTML =
'<option value="All">All Colleges</option>';


[...colleges].forEach(c=>{

if(c)
select.innerHTML +=
`<option value="${c}">
${c}
</option>`;

});

}