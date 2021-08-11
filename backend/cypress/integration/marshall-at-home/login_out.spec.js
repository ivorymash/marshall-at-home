/// <reference types="cypress" />

describe("Users loggin into their accounts", () => {
  beforeEach(() => {
    cy.visit("/index.html");
  });

  const user_email = "JeremyLim96@ichat.sp.edu.sg";
  const user_password = "&FT6J#^y<DwRpwsB";
  const admin_email = "stanley1994@ichat.sp.edu.sg";
  const admin_password = "bxP(cgBx7-)2E%'b";

  it("login to an account as a user then log out", () => {
    cy.get("#email").type(user_email).should("have.value", user_email);

    cy.get("#password").type(user_password).should("have.value", user_password);

    cy.get(":submit").click();

    cy.request("POST", "http://localhost:3000/user", {
      email: user_email,
      password: user_password,
    }).should((response) => {
      expect(response.status).to.eq(202);
    });

    cy.url().should("include", "/home.html");

    cy.get(".navbar-nav li").should("have.length", 3);

    cy.get("#homeHeader").should("contain.text", "Welcome back, Jeremy!");

    cy.get(":nth-child(3) > .nav-link").click();

    cy.get("#logOut").click();
  });

  it("login to an account as a admin then log out", () => {
    cy.get("#email").type(admin_email).should("have.value", admin_email);

    cy.get("#password")
      .type(admin_password)
      .should("have.value", admin_password);

    cy.get(":submit").click();

    cy.request("POST", "http://localhost:3000/user", {
      email: admin_email,
      password: admin_password,
    }).should((response) => {
      expect(response.status).to.eq(202);
    });

    cy.url().should("include", "/home.html");

    cy.get(".navbar-nav li").should("have.length", 5);

    cy.get("#homeHeader").should("contain.text", "Welcome back, Stanley!");

    cy.get(":nth-child(3) > .nav-link").click();

    cy.get("#logOut").click();
  });
});
