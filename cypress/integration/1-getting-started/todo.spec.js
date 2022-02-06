/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";

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
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("There should be seven rows (1 label row, 5 guess rows, 1 answer row", () => {
    GamePage.row().should('have.length', 7)
  });
});

describe("Player wins the game on the first guess", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses correctly", () => {
    GamePage.input().type("Pikachu").type("{enter}");
  });
  it("There should be two rows (1 label row, and 1 guess row", () => {
    GamePage.row().should('have.length', 2)
  });
  it("Starts a new game", () => {
    GamePage.startOver().click();
  });
});

describe("Player wins the game on the last guess", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses incorrectly", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("Guesses correctly", () => {
    GamePage.input().type("Pikachu").type("{enter}");
  });
});



