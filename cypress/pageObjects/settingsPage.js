import BasePage from "./basePage";


class SettingsPage extends BasePage{
    leftSlider() {
      return cy.get(".example-thumb-0");
    }
    rightSlider() {
      return cy.get(".example-thumb-1");
    }
    cbFriendly() {
      return cy.get(".settings-option-container div:nth-of-type(1) input[type='checkbox']");
    }
    darkTheme() {
      return cy.get(".settings-option-container div:nth-of-type(2) input[type='checkbox']");
    }
  }
  
  export default new SettingsPage()