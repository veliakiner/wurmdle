/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";
import SettingsPage from "../../pageObjects/settingsPage";

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("The accesibility buttons don't break the game", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
    GamePage.settingsToggle().click();
    SettingsPage.cbFriendly().check()
    SettingsPage.darkTheme().check()
    SettingsPage.settingsToggle().click();

    GamePage.input().type("Mew").type("{enter}");
    GamePage.input().type("Pikachu").type("{enter}");
    GamePage.row().should('have.length', 3)
  });
});
