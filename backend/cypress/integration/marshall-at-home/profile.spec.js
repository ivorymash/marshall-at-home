/// <reference types="cypress" />

describe("User's profile page", () => {
  beforeEach(() => {
    cy.visit("/index.html");
  });

  const email = "ce30116@ichat.sp.edu.sg";
  const password = "jon";

  const updated_email = "jonnyenglish@ichat.sp.edu.sg";

  it("goes to profile page and update profile", () => {
    cy.get("#email").type(email).should("have.value", email);

    cy.get("#password").type(password).should("have.value", password);

    cy.get(":submit").click();

    cy.request("POST", "http://localhost:3000/user", {
      email: email,
      password: password,
    }).should((response) => {
      expect(response.status).to.eq(202);
    });

    cy.url().should("include", "/home.html");

    cy.get(".navbar-nav li").should("have.length", 3);

    cy.get("#homeHeader").should("contain.text", "Welcome back, Jonny!");

    cy.get(":nth-child(3) > .nav-link").click();

    cy.get("#username")
      .clear()
      .type("JonnyEnglish")
      .should("have.value", "JonnyEnglish");

    cy.get("#email")
      .clear()
      .type("jonnyenglish@ichat.sp.edu.sg")
      .should("have.value", "jonnyenglish@ichat.sp.edu.sg");

    cy.get("#profilePicture")
      .clear()
      .type("https://i.imgur.com/5B0jCTn.jpg")
      .should("have.value", "https://i.imgur.com/5B0jCTn.jpg");

    cy.get("#updateProfile").click();
  });

  it("goes to profile page and update profile back to original", () => {
    cy.get("#email").type(updated_email).should("have.value", updated_email);

    cy.get("#password").type(password).should("have.value", password);

    cy.get(":submit").click();

    cy.request("POST", "http://localhost:3000/user", {
      email: updated_email,
      password: password,
    }).should((response) => {
      expect(response.status).to.eq(202);
    });

    cy.url().should("include", "/home.html");

    cy.get(".navbar-nav li").should("have.length", 3);

    cy.get("#homeHeader").should("contain.text", "Welcome back, JonnyEnglish!");

    cy.get(":nth-child(3) > .nav-link").click();

    cy.get("#username").clear().type("Jonny").should("have.value", "Jonny");

    cy.get("#email").clear().type(email).should("have.value", email);

    cy.get("#profilePicture")
      .clear()
      .type(
        "https://i.pinimg.com/originals/96/d4/5d/96d45d18c5237f06b79a6a4e6452a510.png"
      )
      .should(
        "have.value",
        "https://i.pinimg.com/originals/96/d4/5d/96d45d18c5237f06b79a6a4e6452a510.png"
      );

    cy.get("#updateProfile").click();
  });
});
