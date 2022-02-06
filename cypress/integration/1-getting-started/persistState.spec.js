import GamePage from "../../pageObjects/gamePage";

// Currently fails because Cypress trashes local storage when you refresh a page 
// describe("Player can resume their game when they navigate away", () => {
//   it("opens the app", () => {
//     cy.visit("http://localhost:3000/");
//   });
//   it("Guesses incorrectly", () => {
//     GamePage.input().type("Mew").type("{enter}");
//   });
//   it("opens the app again", () => {
//     cy.reload();
//   });
//   it("There should be two rows (1 label row, 1 guess rows", () => {
//     GamePage.row().should('have.length', 2);
//   });
// });
