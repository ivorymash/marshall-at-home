
function signInMessage() {
    // document.cookie = "user=Yourmother";
    console.log("doing this");
    var signedIn = window.sessionStorage.getItem('user');
    //signedIn returns either the value of the cookie or null, depending on if the cookie exists.
    var signInMsg = "Signed in as "
    if (signedIn == null) {
        signInMsg += "Guest";
        loginBtn(false);
    } else {
        signInMsg += signedIn;
        loginBtn(true);
    }

    document.getElementById("signInBanner").innerHTML = signInMsg
}


function loginBtn(isLoggedIn){

    if(isLoggedIn){
        //change button to a log out button instead;
        document.getElementById("logInOrOut").setAttribute( "onClick", "javascript: logOut();" );
        document.getElementById("logInOrOut").innerHTML = "Log Out"
    }else{
        document.getElementById("logInOrOut").setAttribute( "onClick", "javascript: logIn();" );
        document.getElementById("logInOrOut").innerHTML = "Log In"
        document.getElementById("logInOutDiv").innerHTML += `<button id="signUp" onClick="signUp()">Sign Up</button>`
    }
}

function logOut(){
    window.localStorage.removeItem('token');
    window.sessionStorage.removeItem('token');
    window.location.replace("login.html");
}
