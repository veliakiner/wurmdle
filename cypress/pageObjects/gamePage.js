class GamePage {
    input() {
      return cy.get("input");
    }
    incorrectInput() {
      return cy.get(".glow")
    }
    row() {
      return cy.get('.board-row');
    }
    startOver() {
        return cy.get(".start-over");
    }
  }
  
  export default new GamePage()