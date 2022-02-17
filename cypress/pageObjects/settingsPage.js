import BasePage from "./basePage";


class SettingsPage extends BasePage{
    leftSlider() {
      return cy.get(".example-thumb-0");
    }
    rightSlider() {
      return cy.get(".example-thumb-1");
    }
    cbFriendly() {
      return cy.get(".control > div:nth-of-type(2) input[type='checkbox']");
    }
    darkTheme() {
      return cy.get(".control > div:nth-of-type(3) input[type='checkbox']");
    }
  }
  
  export default new SettingsPage()