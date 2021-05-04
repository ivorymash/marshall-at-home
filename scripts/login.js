function signIn() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  console.log(username, password);
  let keepSignedIn = document.getElementById("keepSignedIn").checked;

  fetch("http://localhost:3000/user",
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ username: username, password: password })
    })
    .then(res => res.json()).then(data => {
      if(keepSignedIn){
        localStorage.setItem('token', data.token); //sets to storage, which is persistent
      }else{
        sessionStorage.setItem('token', data.token); //temporary, only for current tab
        sessionStorage.setItem('user', username);
      }

      window.location.replace("index.html");

    })
    .catch(function (res) { console.log(res) })

}
