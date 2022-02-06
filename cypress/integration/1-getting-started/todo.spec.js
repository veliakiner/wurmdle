/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Should have the number of expected rows", () => {
    cy.get('.board-row').should('have.length', 7)
  });
});

describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("opens the app", () => {
    cy.visit("http://localhost:3000/Mew");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Starts a new game", () => {
    cy.get(".start-over").click();
  });
});

describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });

  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses a Pokemon", () => {
    cy.get("input").type("Pikachu").type("{enter}");
  });
});
