import BasePage from "./basePage";


class SettingsPage extends BasePage{
    leftSlider() {
      return cy.get(".example-thumb-0");
    }
    rightSlider() {
      return cy.get(".example-thumb-1");
    }
  }
  
  export default new SettingsPage()