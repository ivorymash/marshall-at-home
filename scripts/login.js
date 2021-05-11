function signIn() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log(email, password);
  let keepSignedIn = document.getElementById("keepSignedIn").checked;

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
      if(keepSignedIn){
        localStorage.setItem('token', data.token); //sets to storage, which is persistent
        localStorage.setItem('user', data.username);
        localStorage.setItem('id', data.id);
      }else{
        sessionStorage.setItem('token', data.token); //temporary, only for current tab
        sessionStorage.setItem('user', data.username);
        sessionStorage.setItem('id', data.id);
      }

      window.location.replace("index.html");

    })
    .catch(function (res) { console.log(res) })

}
