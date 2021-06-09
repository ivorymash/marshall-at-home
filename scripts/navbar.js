function lecturerNavbar() {

    var userType = window.localStorage.getItem('userType');
    if (userType == null) {
      userType = window.sessionStorage.getItem('userType');
    }

    navbar = document.getElementById("navbar");
  
    if (userType == 2) {
      navbar.innerHTML += `<li class="nav-item">
      <a class="nav-link" href="students.html">View Students</a>
    </li>` //use this to deal with the lecturer stuff.
    }
}