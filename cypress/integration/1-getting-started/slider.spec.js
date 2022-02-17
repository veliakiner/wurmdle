/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";
import SettingsPage from "../../pageObjects/settingsPage";

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("The slider lets you select different mons", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
    GamePage.settingsToggle().click();
    SettingsPage.rightSlider().type("{leftArrow}").type("{leftArrow}")
    SettingsPage.settingsToggle().click();
    GamePage.input().type("Smeargle").type("{enter}");
    GamePage.row().should('have.length', 1)
    GamePage.incorrectInput().should('be.visible')
    GamePage.settingsToggle().click();
    SettingsPage.leftSlider().type("{rightArrow}").type("{rightArrow}").type("{rightArrow}");
    SettingsPage.settingsToggle().click();
    GamePage.input().type("Heatran").type("{enter}");
    GamePage.row().should('have.length', 2)
    GamePage.settingsToggle().click();
    SettingsPage.leftSlider().type("{leftArrow}").type("{leftArrow}").type("{leftArrow}");
    SettingsPage.settingsToggle().click();
    GamePage.input().type("Mew").type("{enter}");
    GamePage.incorrectInput().should('be.visible')
    GamePage.row().should('have.length', 2)
  });
});
