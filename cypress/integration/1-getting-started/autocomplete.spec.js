/// <reference types="cypress" />

import GamePage from "../../pageObjects/gamePage";


afterEach(function () {
  if (this.currentTest.state === "failed") {
    Cypress.runner.stop();
  }
});

describe("Search autocomplete", () => {
    it("opens the app", () => {
      cy.visit("http://localhost:3000/Pikachu");
    });
    it("Start typing", () => {
      GamePage.input().type("Pik").type("{enter}");
    });
    it("There should be two rows (1 label row, and 1 guess row", () => {
      GamePage.row().should('have.length', 2)
    });
  });


  describe("Search autocomplete browse second option", () => {
    it("opens the app", () => {
      cy.visit("http://localhost:3000/Pikachu");
    });
    it("Guess the first suggestion for Me", () => {
      GamePage.input().type("Me").type("{enter}");
    });
    it("Guess the second suggestion for Me", () => {
      GamePage.input().type("Me").type("{downArrow}").type("{enter}");
    });
    it("There should be three rows (1 label row, and 2 guess row", () => {
      GamePage.row().should('have.length', 3)
    });
  });
