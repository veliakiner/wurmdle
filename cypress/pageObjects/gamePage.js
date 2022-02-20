import BasePage from "./basePage";

class GamePage extends BasePage {
    input() {
      return cy.get("input");
    }
    incorrectInput() {
      return cy.get(".glow")
    }
    submitButton() {
      return cy.get('[type="submit"].input')
    }
    row() {
      return cy.get('.board-row');
    }
    startOver() {
        return cy.get(".start-over > button");
    }
  }
  
  export default new GamePage()