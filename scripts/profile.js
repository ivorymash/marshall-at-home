

function getHistory(){
    userid = window.localStorage.getItem('id');
    if(userid == null) {
        userid = window.sessionStorage.getItem('id');
    }
    removeSpinner("loadingProfile"); //delete this soon
    console.log(userid);

    fetch('http://localhost:3000/user/profile/history'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            
        method: "POST",
        body: JSON.stringify({userid: userid})
        }
    ).then(res => res.json()).then(data => {
        generateTable(data);
        removeSpinner("loadingHistory")
    })

}

function getUserInfo(){
    userid = window.localStorage.getItem('id');
    if(userid == null) {
        userid = window.sessionStorage.getItem('id');
    }
    removeSpinner("loadingProfile");
    console.log(userid);

    fetch('http://localhost:3000/user/profile'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            
        method: "POST",
        body: JSON.stringify({id: userid})
        }
    ).then(res => res.json()).then(data => {
        replaceProfileFields(data[0]);
    })

}

function replaceProfileFields(data){
    console.log(data);
}

function generateTable(data){ //and other stuff
    username = window.localStorage.getItem("user");
    if(username == null) {
        username = window.sessionStorage.getItem("user");
    }
    document.getElementById("nameOfUser").innerHTML = "Profile of " + username
    var tablehtml = `<table> <tr> <th>Time</th> <th>Topic</th> <th>Score</th> </tr>`
    for(i=0; i< data.length; i++){
        tablehtml += `<tr> <th>`
        tablehtml += data[i].time_of_quiz;
        tablehtml += `</th> <th>`
        if(data[i].topic == null){
            tablehtml += "None"
        }else{
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
    window.location.replace("login.html");
  }