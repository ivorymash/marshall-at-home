function getAllStudents() {
    fetch('http://localhost:3000/students'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            method: "GET",
        }
    ).then(res => res.json()).then(data => {
        console.log(data);
        populateTableAllStudent(data);
    })
}

function populateTableAllStudent(data) {
    var tableHTML = "";
    for (i = 0; i < data.length; i++) {
        tableHTML += `<tr>`;
        tableHTML += `<th>${data[i].id}</th>`;
        tableHTML += `<td>${data[i].username}</td>`;
        tableHTML += `<td>${data[i].email}</td>`;
        tableHTML += `<td>${data[i].supervisor_id ?? 'none'}</td>`;
        if (data[i].supervisor_id == null || data[i].supervisor_id == "") { //stuff
            console.log("no assigned lecturer");
            tableHTML += `<td><button type="button" id="studentbtn${data[i].id}" class="btn btn-outline-warning" onclick="removeStudent(${data[i].id})">Add Student</button></td>`
        }
        else {
            tableHTML += `<td><button type="button" id="studentbtn${data[i].id} class="btn btn-outline-warning" onclick="addStudent(${data[i].id})">Remove Student</button></td>`
        }
    }
    document.getElementById("allStudentsTableBody").innerHTML = tableHTML;
}