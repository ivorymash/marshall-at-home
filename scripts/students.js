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

function generateAddStudentButton(id){
    return `<td><button type="button" id="studentbtn${id}" class="btn btn-outline-warning w-80" onclick="addStudent(${id})">Add Student</button></td>`
}

function generateRemoveStudentButton(id){
    return `<td><button type="button" id="studentbtn${id}" class="btn btn-outline-warning w-80" onclick="removeStudent(${id})">Remove Student</button></td>`
}

function populateTableAllStudent(data) {
    var tableHTML = "";
    for (i = 0; i < data.length; i++) {
        tableHTML += `<tr>`;
        tableHTML += `<th>${data[i].id}</th>`;
        tableHTML += `<td>${data[i].username}</td>`;
        tableHTML += `<td>${data[i].email}</td>`;
        tableHTML += `<td>${data[i].lecturer_name ?? 'none'}</td>`; //NULLISH COEASCLINASIDNSA OPERATOR BABEY
        if (data[i].supervisor_id == null || data[i].supervisor_id == "") { //stuff
            tableHTML += generateAddStudentButton(data[i].id);
        }
        else {
            tableHTML += generateRemoveStudentButton(data[i].id);
        }
    }
    document.getElementById("allStudentsTableBody").innerHTML = tableHTML;
}



function addStudent(id){
    document.getElementById
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

function removeStudent(id){
    alert("removing dis bitch");
}