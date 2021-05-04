async function signIn() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username,password);
    let keepSignedIn = document.getElementById("keepSignedIn").checked;

    fetch("http://localhost:3000/user",
    {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    })
    .then(function(res){ console.log(res) })
    .catch(function(res){ console.log(res) })
    
}
