function signInMessage() {
  // document.cookie = "user=Yourmother";
  console.log("doing this");
  var signedIn = window.sessionStorage.getItem("user");

  if (signedIn == null) {
    signedIn = window.localStorage.getItem("user");
  }

  homeheaderStuff(signedIn);

//   navbar = document.getElementById("navbar");
//   navbar.innerHTML += `<li class="nav-item">
//   <a class="nav-link" href="#">Extra Things</a>
// </li>` //use this to deal with the lecturer stuff.

// removed for now directly implemented in index.html
}
function homeheaderStuff(username) {
  document.getElementById("homeHeader").innerHTML = "whats good in the hood, " + username;
}

function loginBtn(isLoggedIn) {
  if (isLoggedIn) {
    //change button to a log out button instead;
    document
      .getElementById("logInOrOut")
      .setAttribute("onClick", "javascript: logOut();");
    document.getElementById("logInOrOut").innerHTML = "Log Out";
  } else {
    document
      .getElementById("logInOrOut")
      .setAttribute("onClick", "javascript: logIn();");
    document.getElementById("logInOrOut").innerHTML = "Log In";
    document.getElementById(
      "logInOutDiv"
    ).innerHTML += `<button id="signUp" onClick="signUp()">Sign Up</button>`;
  }
}