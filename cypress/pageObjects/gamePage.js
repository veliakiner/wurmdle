class GamePage {
    input() {
      return cy.get("input");
    }
    row() {
      return cy.get('.board-row');
    }
    startOver() {
        return cy.get(".start-over");
    }
  }
  
  export default new GamePage()