/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";

afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("The slider lets you select different mons", () => {
  it("opens the app", () => {
    cy.visit("http://localhost:3000/Pikachu");
  });
  it("Select only Gen 1", () => {
    GamePage.rightSlider().type("{leftArrow}").type("{leftArrow}");
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
  it("Select only Gen 4", () => {
    GamePage.leftSlider().type("{rightArrow}").type("{rightArrow}").type("{rightArrow}");
  });
  it("Try to select a gen 4 mon", () => {
    GamePage.input().type("Heatran").type("{enter}");
  });
  it("There should be 2 rows (1 label row, 1  guess rows", () => {
    GamePage.row().should('have.length', 2)
  });
  it("Try to move the slider to include gen 1", () => {
    GamePage.leftSlider().type("{leftArrow}").type("{leftArrow}").type("{leftArrow}");
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
