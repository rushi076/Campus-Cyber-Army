import { auth, db } from "./firebase-config.js";

import {
collection,
doc,
getDoc,
getDocs,
setDoc,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const taskList = document.getElementById("taskList");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const pointsEl = document.getElementById("points");
const completedEl = document.getElementById("completed");
const userNameEl = document.getElementById("userName");

let tasks = [];
let userId = "";



auth.onAuthStateChanged(async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

userId = user.uid;

const userDoc = await getDoc(doc(db,"users",user.uid));

if (userDoc.exists()) {
const data = userDoc.data();
userNameEl.textContent = data.name || "User";
}

await fetchTasks();

});



async function fetchTasks() {

taskList.innerHTML =
"<tr><td colspan='3'>Loading...</td></tr>";

let completed = 0;

tasks = [];

const snapshot =
await getDocs(collection(db,"tasks"));

const allTasks =
snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));


const submissionRefs =
allTasks.map(task =>
getDoc(doc(db,"submissions",`${userId}_${task.id}`))
);


const submissionSnapshots =
await Promise.all(submissionRefs);



allTasks.forEach((task, index) => {

const submission =
submissionSnapshots[index];

const submitted =
submission.exists();

const correct =
submitted && submission.data().correct;


if (correct) completed++;


tasks.push({
...task,
status: submitted ? "Submitted" : "Pending"
});

});


const pointValue = 100;

pointsEl.textContent =
completed * pointValue;

completedEl.textContent =
completed;


await setDoc(doc(db,"users",userId),{

points: completed * pointValue,
completedTasks: completed

}, { merge: true });


renderTasks();

}



function renderTasks() {

let html = "";

tasks.forEach(task => {

html += `
<tr>

<td>${task.name}</td>

<td>${task.status}</td>

<td>

<button
class="submit-btn"
onclick="openTask('${task.id}')"

${task.status === "Submitted"
? "disabled style='opacity:0.6;cursor:not-allowed;'"
: ""}

>

${task.status === "Submitted"
? "Submitted"
: "View"}

</button>

</td>

</tr>

`;

});


taskList.innerHTML =
html ||
`<tr><td colspan="3">No tasks found</td></tr>`;

}




window.openTask = function(id) {

const task =
tasks.find(t => t.id === id);

modal.classList.remove("hidden");


if (task.type === "mcq") {

modalContent.innerHTML =

`
<span class="close-btn"
onclick="closeModal()">

&times;

</span>

<h3>${task.name}</h3>

<p class="desc">
${task.question}
</p>


<form
onsubmit="submitTask('${id}');
return false;">


${task.options.map(opt =>

`<label>

<input type="radio"
name="q"
value="${opt}" required>

${opt}

</label><br>`

).join("")}


<br>

<button
class="submit-btn"
type="submit">

Submit

</button>

</form>
`;

}

else {

modalContent.innerHTML =

`
<span class="close-btn"
onclick="closeModal()">

&times;

</span>

<h3>${task.name}</h3>

<p class="desc">

${task.instruction}

</p>


<form
onsubmit="submitTask('${id}');
return false;">


<input type="file" required>

<br><br>

<button
class="submit-btn"
type="submit">

Upload & Submit

</button>

</form>
`;

}

}



window.submitTask = async function(id) {

const user =
auth.currentUser;

if (!user) return;


const task =
tasks.find(t => t.id === id);

if (!task) return;


const subRef =
doc(db,"submissions",`${user.uid}_${task.id}`);


let isCorrect = false;

let shouldAwardPoints = false;

const pointValue =
task.points || 100;



if (task.type === "mcq") {

const selected =
document.querySelector(
'input[name="q"]:checked'
);


const answer =
selected?.value;

if (!answer) return;


isCorrect =
answer === task.correctAnswer;

shouldAwardPoints =
isCorrect;


await setDoc(subRef,{

userId: user.uid,
taskId: task.id,
answer: answer,
correct: isCorrect,
timestamp: new Date(),
status: "Submitted"

});

}

else {

isCorrect = true;

shouldAwardPoints = true;


await setDoc(subRef,{

userId: user.uid,
taskId: task.id,
correct: true,
timestamp: new Date(),
status: "Submitted"

});

}



if (shouldAwardPoints) {

await updateDoc(doc(db,"users",user.uid),{

totalPoints: increment(pointValue),
weeklyPoints: increment(pointValue)

});

}


closeModal();

fetchTasks();

}



window.closeModal = function() {

modal.classList.add("hidden");

}



window.logout = function() {

auth.signOut()
.then(() =>
window.location.href =
"login.html");

}