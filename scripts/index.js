function signInMessage() {
  // document.cookie = "user=Yourmother";
  console.log("doing this");
  var signedIn = window.sessionStorage.getItem("user");

  if (signedIn == null) {
    signedIn = window.localStorage.getItem("user");
  }

  //signedIn returns either the value of the cookie or null, depending on if the cookie exists.
  var signInMsg = "WELCOME BACK ";
  if (signedIn == null) {
    signInMsg += "Guest";
    loginBtn(false);
  } else {
    signInMsg += signedIn + "!";
    loginBtn(true);
  }

  var today = new Date();
  var curHr = today.getHours();
  var GM = "";

  if (curHr < 12) {
    GM = "Good Morning, ";
  } else if (curHr < 18) {
    GM = "Good Afternoon, ";
  } else {
    GM = "Good Evening, ";
  }

  var homeHead = GM;
  var homeHead2 = "<br>What would you like to get started with?";
  if (signedIn == null) {
    signInMsg += "Guest";
    loginBtn(false);
  } else {
    homeHead += signedIn + "!";
    homeHead += homeHead2;
    loginBtn(true);
  }

  document.getElementById("profileName").innerHTML = signedIn;
  document.getElementById("signInBanner").innerHTML = signInMsg;
  document.getElementById("homeHeader").innerHTML = homeHead;
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

function logOut() {
  window.localStorage.removeItem("token");
  window.sessionStorage.removeItem("token");
  window.localStorage.removeItem("id");
  window.sessionStorage.removeItem("id");
  window.localStorage.removeItem("user");
  window.sessionStorage.removeItem("user");
  window.location.replace("login.html");
}

/*For the sidebar*/
var menu_btn = document.querySelector("#menu-btn");
var sidebar = document.querySelector("#sidebar");
var container = document.querySelector(".my-container");
menu_btn.addEventListener("click", () => {
  sidebar.classList.toggle("active-nav");
  container.classList.toggle("active-cont");
});
