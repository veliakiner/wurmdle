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

describe("Player loses the game", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("There should be seven rows (1 label row, 5 guess rows, 1 answer row", () => {
    cy.get('.board-row').should('have.length', 7)
  });
});

describe("Player wins the game", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Mew");
  });
  it("Guesses correctly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Starts a new game", () => {
    cy.get(".start-over").click();
  });
});

describe("Player wins the game on the last guess", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    cy.get("input").type("Mew").type("{enter}");
  });
  it("Guesses correctly", () => {
    cy.get("input").type("Pikachu").type("{enter}");
  });
});
