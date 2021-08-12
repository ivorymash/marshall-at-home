/// <reference types="cypress" />

describe("Access learn page and learn knowledge", () => {
  beforeEach(() => {
    cy.visit("/index.html");
  });

  const email = "ce30116@ichat.sp.edu.sg";
  const password = "jon";

  it("go through learn page and return home", () => {
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

    cy.get(":nth-child(1) > .card > .bg-image > a > .mask").click();

    cy.get("#articleid20 > .smth").click();
    cy.get("b").should("contain.text", "Introduction to Airplane Marshalling");
    cy.get(".contentText").should(
      "contain.text",
      "Airplane Marshalling is is visual signalling between ground personnel and pilots on an airport, aircraft carrier or helipad. In this video you will look at an example of someone marshalling a Boeing-747-8F"
    );

    cy.get("#articleid21 > .smth").click();
    cy.get("b").should("contain.text", "Basic Marshalling Signals");
    cy.get(".contentText").should(
      "contain.text",
      "In this video you will learn the basic marshalling signals that would need as a marshaller, or simply to brush up your knowledge. Checkout this video and taxi into your next FBO or fly-in with more confidence!"
    );

    cy.get("#articleid22 > .smth").click();
    cy.get("b").should("contain.text", "Aircraft servicing");
    cy.get(".contentText").should(
      "contain.text",
      "A basic aircraft servicing video that teaches you about safety when there is a aircraft."
    );

    cy.get("#articleid23 > .smth").click();
    cy.get("b").should("contain.text", "Ground Safety Training");
    cy.get(".contentText").should(
      "contain.text",
      "Apart from marshalling, it is also good to understand and know the safety on the ground."
    );

    cy.get(".logo").click();
  });
});
