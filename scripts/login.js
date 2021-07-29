function signIn() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email, password);
  let keepSignedIn = document.getElementById("remember").checked;

  event.preventDefault();

  fetch("http://localhost:3000/user",
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ email: email, password: password })
    })
    .then(res => res.json()).then(data => {
      console.log(data);
      if (data.error) {
        document.getElementById("error").innerHTML = data.error;
        return;
      }
      if (keepSignedIn) {
        localStorage.setItem('token', data.token); //sets to storage, which is persistent
        localStorage.setItem('user', data.username);
        // localStorage.setItem('id', data.id);
        // localStorage.setItem('userType', data.userType);
      } else {
        sessionStorage.setItem('token', data.token); //temporary, only for current tab
        sessionStorage.setItem('user', data.username);
        // sessionStorage.setItem('id', data.id);
        // sessionStorage.setItem('userType', data.userType);
      }

      window.location.replace("home.html");

    })
    .catch(function (res) { console.log(res) })

}

function registerAccount() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if(document.getElementById("lecturer").checked == true){
    var userType = 2;
  }else{
    var userType = 1;
  }
  console.log(userType);

  fetch("http://localhost:3000/user/create",
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ email: email, password: password, username: name, userType: userType })
    }).then(res => {
      if (res.status == "401") {
        alert("something u fucked up");
      }

      if (res.status == "201") {
        console.log("dababy les go");
        window.location.replace("index.html");

      }

    })
    .catch(res => {
      alert(res);
    })

  event.preventDefault();
}