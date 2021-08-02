const form = document.getElementById("form");
const namelol = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkValues();
});

var checkValues = () => {
  namelol.addEventListener("input", (e) => {
    // checks name input
    if (e.target.value === "") {
      errorControl(namelol, "Name cannot be blank");
    } else {
      successControl(namelol);
    }
  });

  email.addEventListener("input", (e) => {
    // checks email input
    if (e.target.value.trim() === "") {
      errorControl(email, "Email cannot be blank");
    } else if (!isEmail(e.target.value.trim())) {
      errorControl(email, "Email is invalid");
    } else {
      successControl(email);
    }
  });

  password.addEventListener("input", (e) => {
    // checks password input
    if (e.target.value === "") {
      errorControl(password, "Password cannot be blank");
    } else {
      successControl(password);
    }
  });
};

var errorControl = (input, message) => {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");

  small.innerText = message;

  formGroup.className = "form-group error";
};

var successControl = (input) => {
  const formGroup = input.parentElement;
  formGroup.className = "form-group success";
};

var isEmail = (email) => {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
};
