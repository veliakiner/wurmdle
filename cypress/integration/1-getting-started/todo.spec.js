/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
describe('Cypress', () => {   
  it('is working', () => {     
      expect(true).to.equal(true)   
  }) 
  
  it('opens the app', () => {   
    cy.visit('http://localhost:3000') 
})
it('Guesses a Pokemon', () => {   
  
  cy.get('input')
    .type('Mew').type("{enter}")
})
it('Guesses a Pokemon', () => {   
  
  cy.get('input')
    .type('Mew').type("{enter}")
})
it('Guesses a Pokemon', () => {   
  
  cy.get('input')
    .type('Mew').type("{enter}")
})
it('Guesses a Pokemon', () => {   
  
  cy.get('input')
    .type('Mew').type("{enter}")
})
it('Guesses a Pokemon', () => {   
  
  cy.get('input')
    .type('Mew').type("{enter}")
})
})