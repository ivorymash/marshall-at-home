function getAllStudents() {
  jwt =
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token");
  fetch("http://localhost:3000/students", {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": `Bearer ${jwt}`,
    },

    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      populateTableAllStudent(data);
    }).catch(() => window.location.replace("404.html"));
}

function generateAddStudentButton(id) {
  return `<td><button type="button" id="studentbtn${id}" class="btn btn-outline-warning w-80" onclick="addStudent(${id})">Add Student</button></td>`;
}

function generateRemoveStudentButton(id) {
  return `<td><button type="button" id="studentbtn${id}" class="btn btn-outline-warning w-80" onclick="removeStudent(${id})">Remove Student</button></td>`;
}

function populateTableAllStudent(data) {
  var tableHTML = "";
  for (i = 0; i < data.length; i++) {
    tableHTML += `<tr>`;
    tableHTML += `<th>${data[i].id}</th>`;
    tableHTML += `<td>${data[i].username}</td>`;
    tableHTML += `<td>${data[i].email}</td>`;
    tableHTML += `<td id="lecturerColumnId${data[i].id}">${
      data[i].lecturer_name ?? "none"
      }</td>`; //NULLISH COEASCLINASIDNSA OPERATOR BABEY
    if (data[i].supervisor_id == null || data[i].supervisor_id == "") {
      //stuff
      tableHTML += generateAddStudentButton(data[i].id);
    } else {
      tableHTML += generateRemoveStudentButton(data[i].id);
    }
  }
  document.getElementById("allStudentsTableBody").innerHTML = tableHTML;
}

function addStudent(id) {
  jwt =
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token");

  fetch("http://localhost:3000/students/lecturer/update", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: `Bearer ${jwt}`,
    },

    method: "POST",
    // removed lecturer's id, use on backend instead
    body: JSON.stringify({ studentID: id}),
  }).then((res) => {
    console.log(res);
  });
}

function removeStudent(id) {
  jwt = window.localStorage.getItem("token") ?? window.sessionStorage.getItem("token");
  // userid = window.localStorage.getItem("id") ?? window.sessionStorage.getItem("id");
  console.log("removing dis bitch");

  fetch("http://localhost:3000/students/lecturer/remove", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: `Bearer ${jwt}`,
    },

    method: "POST",
    body: JSON.stringify({ studentID: id}),
  }).then((res) => {
    console.log(res);
  });
  // window.location.reload();
}

//my students

function getMyStudents() {
  var jwt =
    window.localStorage.getItem("token") ??
    window.sessionStorage.getItem("token");
  // var id =
  //   window.localStorage.getItem("id") ?? window.sessionStorage.getItem("id");

  fetch("http://localhost:3000/students/mystudents", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: `Bearer ${jwt}`,
    },

    method: "POST",
    // body: JSON.stringify({ id: id }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      populateTableMyStudent(data);
    })
    .catch(() => window.location.replace("404.html"));
}

function populateTableMyStudent(data) {
  var tableHTML = "";
  for (i = 0; i < data.length; i++) {
    tableHTML += `<tr>`;
    tableHTML += `<th>${data[i].id}</th>`;
    tableHTML += `<td>${data[i].username}</td>`;
    tableHTML += `<td>${data[i].email}</td>`;
    tableHTML += `<td>${data[i].quizzes_taken}</td>`;
    tableHTML += `<td>${Math.floor(data[i].percentage)??"0"}%</td>`;
  }
  document.getElementById("allStudentsTableBody").innerHTML = tableHTML;
}
