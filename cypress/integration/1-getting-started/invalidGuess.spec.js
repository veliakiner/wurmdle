/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("Invalid guess", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Makes an invalid guess", () => {
    GamePage.input().type("Pikablu").type("{enter}");
  });
  it("The input should glow", () => {
    GamePage.incorrectInput().should('be.visible')
  });
});
