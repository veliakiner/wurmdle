class GamePage {
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
        return cy.get(".start-over");
    }
  }
  
  export default new GamePage()