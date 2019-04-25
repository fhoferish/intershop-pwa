import { HeaderModule } from '../header.module';

export class LoginPage {
  readonly tag = 'ish-login-form';

  readonly header = new HeaderModule();

  static navigateTo() {
    cy.clearCookie('apiToken');
    cy.visit('/login?returnUrl=%2Faccount');
  }

  get content() {
    return cy.get(this.tag);
  }

  fillForm(user: string, password: string) {
    cy.get('input[data-testing-id="login"]')
      .clear()
      .type(user)
      .blur();
    cy.get('input[data-testing-id="password"]')
      .clear()
      .type(password)
      .blur();
    return this;
  }

  submit() {
    cy.server();
    cy.route('GET', '**/customers/**').as('customers');
    cy.wait(500);

    cy.get('button[name="login"]').click();

    return cy.wait('@customers');
  }

  get errorText() {
    return cy.get('div.alert');
  }
}
