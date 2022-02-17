import GamePage from "../../pageObjects/gamePage";

describe("Player can resume their game when they navigate away", () => {
  it("opens the app and reloads halfway through the test", () => {
    cy.visit("http://localhost:3000/");
    GamePage.input().type("Mew").type("{enter}");
    cy.reload();
    GamePage.row().should('have.length', 2);
  });
});
