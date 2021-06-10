

function getHistory() {
    userid = window.localStorage.getItem('id')??window.sessionStorage.getItem('id');
    removeSpinner("loadingProfile"); //delete this soon
    console.log(userid);

    fetch('http://localhost:3000/user/profile/history'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            method: "POST",
            body: JSON.stringify({ userid: userid })
        }
    ).then(res => res.json()).then(data => {
        generateTable(data);
        removeSpinner("loadingHistory")
    })

}

function getUserInfo() {
    userid = window.localStorage.getItem('id')??window.sessionStorage.getItem('id');
    removeSpinner("loadingProfile");
    console.log(userid);

    fetch('http://localhost:3000/user/profile'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            method: "POST",
            body: JSON.stringify({ id: userid })
        }
    ).then(res => res.json()).then(data => {
        replaceProfileFields(data[0]);
    })

}

function updateProfile() {
    var email = document.getElementById("email").value;
    var name = document.getElementById("username").value;
    var pfp = document.getElementById("profilePicture").value;
    if (name == "") { //casual checking
        var name = window.localStorage.getItem('user')??window.sessionStorage.getItem('user');
    }
    var inSessionStorage = false; //sneaky little flag to use later.

    var jwt = window.localStorage.getItem('token');
    if (jwt == null) {
        jwt = window.sessionStorage.getItem('token');
        inSessionStorage = true;
    }

    var id = window.localStorage.getItem('id')??window.sessionStorage.getItem('id');


    fetch('http://localhost:3000/user/profile/update'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': `Bearer ${jwt}`
            },

            method: "PUT",
            body: JSON.stringify({ username: name, email: email, pfp: pfp, id: id })
        }
    ).then(res => res.json()).then(data => {
        console.log(data);
        if (inSessionStorage) {
            sessionStorage.setItem('token', data.token); //temporary, only for current tab
            sessionStorage.setItem('user', data.username);
            sessionStorage.setItem('id', data.id);
        } else {
            localStorage.setItem('token', data.token); //sets to storage, which is persistent
            localStorage.setItem('user', data.username);
            localStorage.setItem('id', data.id);
        }
        location.reload();
    });

}

function replaceProfileFields(data) {
    console.log(data);
    if(data.profile_pic_link !== "" && data.profile_pic_link !== null){
        document.getElementById("pfp").src = data.profile_pic_link; //photo
    }
    document.getElementById("nameOfUser").innerHTML = "Profile of " + data.username;
    document.getElementById("profilePicture").value = data.profile_pic_link;
    document.getElementById("username").value = data.username;
    document.getElementById("email").value = data.email;
}

function convertEpochToDate(ts) {
    var options = { weekday: 'long', month: 'long', day: 'numeric' }
    var dateObj = new Date(ts * 1000);
    return dateObj.toLocaleString("en-US");
}

function generateTable(data) { //and other stuff
    username = window.localStorage.getItem("user")??window.sessionStorage.getItem("user");

    var tablehtml = `<table class="table table-hover"> <tr> <th>Time</th> <th>Topic</th> <th>Score</th> </tr>`
    for (i = 0; i < data.length; i++) {
        tablehtml += `<tr> <th>`
        tablehtml += convertEpochToDate(data[i].time_of_quiz);
        tablehtml += `</th> <th>`
        if (data[i].topic == null) {
            tablehtml += "None"
        } else {
            tablehtml += data[i].topic;
        }
        tablehtml += `</th> <th>`
        tablehtml += data[i].correct_questions;
        tablehtml += ` / `;
        tablehtml += data[i].total_questions;
        tablehtml += `</tr>`;
    }
    tablehtml += ` </table>`
    document.getElementById("quizHistoryTable").innerHTML = tablehtml;
}

function removeSpinner(id) {
    document.getElementById(id).style.display = "none";
}

function logOut() {
    window.localStorage.removeItem("token");
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("id");
    window.sessionStorage.removeItem("id");
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("user");
    window.localStorage.removeItem("userType");
    window.sessionStorage.removeItem("userType");
    window.location.replace("login.html");
}