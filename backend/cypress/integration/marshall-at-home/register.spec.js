/// <reference types="cypress" />

describe("Users registering an account", () => {
  beforeEach(() => {
    cy.visit("/index.html");
  });

  var randomNumber = Math.floor(Math.random() * 934823);
  const user_username = "userRegister";
  const user_password = "userRegister";
  const user_email = `userRegister${randomNumber}@gmail.com`;

  const admin_username = "adminRegister";
  const admin_password = "adminRegister";
  const admin_email = `adminRegister${randomNumber}@gmail.com`;

  it("register account as a user", () => {
    cy.get(".mt-4 > a").click();

    cy.url().should("include", "/register.html");

    cy.get("#name").type(user_username).should("have.value", user_username);
    cy.get("#email").type(user_email).should("have.value", user_email);
    cy.get("#password").type(user_password).should("have.value", user_password);
    cy.get(".m-0 > .btn").click();

    cy.url().should("include", "/index.html");
  });

  it("register account as an admin", () => {
    cy.get(".mt-4 > a").click();

    cy.url().should("include", "/register.html");

    cy.get("#name").type(admin_username).should("have.value", admin_username);
    cy.get("#email").type(admin_email).should("have.value", admin_email);
    cy.get("#password").type(admin_password).should("have.value", admin_password);
    cy.get(".btn-group > :nth-child(2)").click();
    cy.get(".m-0 > .btn").click();

    cy.url().should("include", "/index.html");
  });
});
