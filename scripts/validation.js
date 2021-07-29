const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    checkValues();

});

var checkValues = () => {
  // get the values from the inputs
  const emailInput = email.value.trim();
  const passwordInput = password.value.trim();

  // checks email input
  if (emailInput === "") {
    errorControl(email, "Email cannot be blank");
  } else if (!isEmail(emailInput)) {
    errorControl(email, "Email not valid");
  } else {
    successControl(email);
  }

  // checks password input
  if (passwordInput === "") {
    errorControl(password, "Password cannot be blank");
  }  else {
    successControl(password);
  }
}

var errorControl = (input, message) => {
    const formGroup = input.parentElement;
    const small = formGroup.querySelector('small');

    small.innerText = message;

    formGroup.className = "form-group error";
}

var successControl = (input) => {
    const formGroup = input.parentElement;
    formGroup.className = "form-group success";
}

var isEmail = (email) => {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      .test(email);
}