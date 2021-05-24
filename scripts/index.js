function signInMessage() {
  // document.cookie = "user=Yourmother";
  console.log("doing this");
  var signedIn = window.sessionStorage.getItem("user").toUpperCase();
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
    GM = "GOOD MORNING ";
  } else if (curHr < 18) {
    GM = "GOOD AFTERNOON ";
  } else {
    GM = "GOOD EVENING ";
  }

  var homeHead = GM;
  var homeHead2 = "<br>WHAT WOULD YOU LIKE TO GET STARTED WITH?";
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
