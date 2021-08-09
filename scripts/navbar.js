function lecturerNavbar() { 
 
  var jwt = 
    window.localStorage.getItem("token") ?? 
    window.sessionStorage.getItem("token"); 
   
  var navbar = document.getElementById("navbar"); 
 
  fetch("http://localhost:3000/topNav", {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "authorization": `Bearer ${jwt}`,
    },

    method: "GET",
    // body: JSON.stringify({ id: id }),
  })
    .then((res) => res.text())
    .then((data) => {
      if (parseInt(data) === 2) {
        navbar.innerHTML += `<li class="nav-item"> 
      <a class="nav-link" href="students.html">All Students</a> 
    </li><li class="nav-item"> 
    <a class="nav-link" href="mystudents.html">My Students</a> 
  </li>`; //use this to deal with the lecturer stuff.
      }
    }); 
}