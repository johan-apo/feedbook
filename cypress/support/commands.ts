import "./auth0-provider-commands/auth0";

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add(`getBySelLike`, (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});
