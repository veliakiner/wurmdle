import BasePage from "./basePage";

class GamePage extends BasePage {
    input() {
      return cy.get("input");
    }
    incorrectInput() {
      return cy.get(".glow")
    }
    submitButton() {
      return cy.get('button.input:nth-of-type(1)')
    }
    row() {
      return cy.get('.board-row');
    }
    startOver() {
        return cy.get(".start-over > button");
    }
  }
  
  export default new GamePage()