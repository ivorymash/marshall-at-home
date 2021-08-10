function signInLogic(){
    //check if user is signed in if not throw them at the login page
    //find the fucking token
    token = window.localStorage.getItem('token')??window.sessionStorage.getItem('token'); // should have used a framework like angular that has a path guard
    if(token == null){ //this is janky and bad, should find a better way someday.
        // alert("not signed in.");
        window.location.replace("index.html");

    }
}