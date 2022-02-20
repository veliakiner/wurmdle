/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";
import SettingsPage from "../../pageObjects/settingsPage";

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("You can't submit duplicate guesses", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
    GamePage.input().type("Smeargle").type("{enter}");
    GamePage.input().type("Smeargle").type("{enter}");
    GamePage.row().should('have.length', 2)
  });
});
