
function signInMessage() {
    // document.cookie = "user=Yourmother";
    var signedIn = (document.cookie.match(/^(?:.*;)?\s*user\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
    //signedIn returns either the value of the cookie or null, depending on if the cookie exists.
    var signInMsg = "Signed in as "
    if (signedIn == null) {
        alert("Not signed in");
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

