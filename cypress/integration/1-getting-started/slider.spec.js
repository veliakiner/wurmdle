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
  });
  it("Open the settings page", () => {
    GamePage.settingsToggle().click();
  });
  it("Select only Gen 1", () => {
    SettingsPage.rightSlider().type("{leftArrow}").type("{leftArrow}")
  });
  it("Go back to the game page", () => {
    SettingsPage.settingsToggle().click();
  });
  it("Try to select a gen 2 mon", () => {
    GamePage.input().type("Smeargle").type("{enter}");
  });
  it("There should be 1 row (1 label row, 0  guess rows", () => {
    GamePage.row().should('have.length', 1)
  });
  it("The input should glow", () => {
    GamePage.incorrectInput().should('be.visible')
  });
  it("Open the settings page", () => {
    GamePage.settingsToggle().click();
  });
  it("Select only Gen 4", () => {
    SettingsPage.leftSlider().type("{rightArrow}").type("{rightArrow}").type("{rightArrow}");
  });
  it("Go back to the game page", () => {
    SettingsPage.settingsToggle().click();
  });
  it("Try to select a gen 4 mon", () => {
    GamePage.input().type("Heatran").type("{enter}");
  });
  it("There should be 2 rows (1 label row, 1  guess rows", () => {
    GamePage.row().should('have.length', 2)
  });
  it("Open the settings page", () => {
    GamePage.settingsToggle().click();
  });
  it("Try to move the slider to include gen 1", () => {
    SettingsPage.leftSlider().type("{leftArrow}").type("{leftArrow}").type("{leftArrow}");
  });
  it("Go back to the game page", () => {
    SettingsPage.settingsToggle().click();
  });
  it("Try to select a gen 1 mon", () => {
    GamePage.input().type("Mew").type("{enter}");
  });
  it("The input should glow", () => {
    GamePage.incorrectInput().should('be.visible')
  });
  it("There should be 2 rows (1 label row, 1  guess rows", () => {
    GamePage.row().should('have.length', 2)
  });
});
