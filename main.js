// ? JSON SERVER
const STUDENTS_API = "http://localhost:8000/users";
// ? buttons
let addUserBtn = document.querySelector("#addStudent-btn");
//? inputs
let nameInp = document.querySelector("#reg-name");
let secondNameInp = document.querySelector("#reg-secondname");
let numberInp = document.querySelector("#reg-number");
let weeklyKPIInp = document.querySelector("#reg-weekly");
let monthlyKPIInp = document.querySelector("#reg-monthly");

//! add student btn start ---------------------------------------------------------------
async function addUser() {
  if (
    !nameInp.value.trim() ||
    !secondNameInp.value.trim() ||
    !numberInp.value.trim() ||
    !weeklyKPIInp.value.trim() ||
    !monthlyKPIInp.value.trim()
  ) {
    alert("Some inputs are empty!");
    return;
  }

  let userObj = {
    name: nameInp.value,
    secondName: secondNameInp.value,
    number: numberInp.value,
    weeklyKPI: weeklyKPIInp.value,
    monthlyKPI: monthlyKPIInp.value,
  };

  fetch(STUDENTS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  alert("Added successfully!");

  nameInp.value = "";
  secondNameInp.value = "";
  numberInp.value = "";
  weeklyKPIInp.value = "";
  monthlyKPIInp.value = "";
  render();
}

addUserBtn.addEventListener("click", addUser);
//! add student btn end ---------------------------------------------------------------
//  read start ------------------------------------------------------------------------
let currentPage = 1;
let search = "";

async function render() {
  let studentsList = document.querySelector("#students-list");
  studentsList.innerHTML = "";
  let requestAPI = `${STUDENTS_API}?q=${search}&_page=${currentPage}&_limit=6`;
  let res = await fetch(requestAPI);
  let data = await res.json();

  data.forEach(item => {
    studentsList.innerHTML += `
        <div class="card m-5">
            <img src="./blank-profile-picture-973460__340.webp" class="card-img-top" alt="..." height="225">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <h6 class="card-text">${item.secondName}</h6>
                <p class="card-text">phone number: ${item.number}</p>
                <p class="card-text">Weekly KPI: ${item.weeklyKPI}</p>
                <p class="card-text">Monthly KPI: ${item.monthlyKPI}</p>
                ${`<a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
                <a href="#" class="btn btn-dark btn-edit" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop" id="${item.id}">EDIT</a>`}
            </div>
        </div>
        `;
  });

  if (data.length === 0) return;
  addEditEvent();
  addDeleteEvent();
}
render();
//  read end ----------------------------------------------------------------------------

//? delete btn start --------------------------------------------------------------------
async function deleteStudent(e) {
  let studentId = e.target.id;

  await fetch(`${STUDENTS_API}/${studentId}`, {
    method: "DELETE",
  });
  render();
}

function addDeleteEvent() {
  let deleteStudentBtn = document.querySelectorAll(".btn-delete");
  deleteStudentBtn.forEach(item => {
    item.addEventListener("click", deleteStudent);
  });
}
//? delete btn end ----------------------------------------------------------------------

// update btn start ---------------------------------------------------------------------
let saveChangesBtn = document.querySelector(".save-changes-btn");

function checkCreateAndSaveBtn() {
  if (saveChangesBtn.id) {
    addUserBtn.setAttribute("style", "display: none;");
    saveChangesBtn.setAttribute("style", "display: block;");
  } else {
    addUserBtn.setAttribute("style", "display: block;");
    saveChangesBtn.setAttribute("style", "display: none;");
  }
}
checkCreateAndSaveBtn();

async function addStudentDataToForm(e) {
  let studentId = e.target.id;
  let res = await fetch(`${STUDENTS_API}/${studentId}`);
  let studentObj = await res.json();

  nameInp.value = studentObj.name;
  secondNameInp.value = studentObj.secondName;
  numberInp.value = studentObj.number;
  weeklyKPIInp.value = studentObj.weeklyKPI;
  monthlyKPIInp.value = studentObj.monthlyKPI;

  saveChangesBtn.setAttribute("id", studentObj.id);

  checkCreateAndSaveBtn();
}

function addEditEvent() {
  let btnEditStudent = document.querySelectorAll(".btn-edit");
  btnEditStudent.forEach(item => {
    item.addEventListener("click", addStudentDataToForm);
  });
}

async function saveChanges(e) {
  let updatedStudentObj = {
    name: nameInp.value,
    secondName: secondNameInp.value,
    number: numberInp.value,
    weeklyKPI: weeklyKPIInp.value,
    monthlyKPI: monthlyKPIInp.value,
    id: e.target.id,
  };

  await fetch(`${STUDENTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedStudentObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("Edited succesfully!");

  nameInp.value = "";
  secondNameInp.value = "";
  numberInp.value = "";
  weeklyKPIInp.value = "";
  monthlyKPIInp.value = "";

  saveChangesBtn.removeAttribute("id");

  checkCreateAndSaveBtn();

  render();
}

saveChangesBtn.addEventListener("click", saveChanges);
// update btn end ---------------------------------------------------------------------

//! search start ------------------------------------------------------------------------
let searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", () => {
  search = searchInp.value;
  currentPage = 1;
  render();
});
//! search end --------------------------------------------------------------------------

//? pagination start --------------------------------------------------------------------
let nextPage = document.querySelector("#next-page");
let prevPage = document.querySelector("#prev-page");

async function checkPages() {
  let res = await fetch(STUDENTS_API);
  let data = await res.json();
  let pages = Math.ceil(data.length / 6);

  if (currentPage === 1) {
    prevPage.style.display = "none";
    nextPage.style.display = "block";
  } else if (currentPage === pages) {
    prevPage.style.display = "block";
    nextPage.style.display = "none";
  } else {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
  }
}
checkPages();

nextPage.addEventListener("click", () => {
  currentPage++;
  render();
  checkPages();
});

prevPage.addEventListener("click", () => {
  currentPage--;
  render();
  checkPages();
});
//? pagination end ----------------------------------------------------------------------

// main page btn start ------------------------------------------------------------------
let homeBtn = document.querySelector("#logo-btn");
homeBtn.addEventListener("click", () => {
  currentPage = 1;
  category = "";
  search = "";
  render();
  checkPages();
});
// main page btn end --------------------------------------------------------------------
