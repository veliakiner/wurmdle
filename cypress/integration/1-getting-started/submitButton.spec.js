/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";


afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("Using the submit button", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Makes an invalid guess", () => {
    GamePage.input().type("Pikablu");
  });
  it("Hit the button", () => {
    GamePage.submitButton().click();
  });
  it("The input should glow", () => {
    GamePage.incorrectInput().should('be.visible')
  });
  it("The input box should clear", () => {
    GamePage.input().should('have.value', "")
  });
  it("Makes a valid guess", () => {
    GamePage.input().type("Mew");
    GamePage.submitButton().click();
  });
  it("There should be two rows (1 label row, and 1 guess row", () => {
    GamePage.row().should('have.length', 2)
  });
});
