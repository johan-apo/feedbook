/// <reference path="../../global.d.ts" />
export {};

Cypress.Commands.add("login", (username, password) => {
  const args = { username, password };
  const auth0origin = `https://${Cypress.env("auth0_domain")}`;

  Cypress.log({
    name: "login",
    message: `Logging in with username: ${username}`,
    displayName: "LOGIN",
  });

  cy.session(
    args,
    () => {
      cy.visit("/");
      cy.get("button").contains("Log in").click();

      cy.origin(auth0origin, { args }, ({ username, password }) => {
        cy.get('input[id="username"]', { log: false }).type(username);
        cy.get('input[type="password"]', { log: false }).type(password);
        cy.get("button[type='submit']", { log: false })
          .contains(/^Continue$/)
          .click();
      });
    },
    {
      validate() {
        cy.request("/api/auth/me").its("status").should("eq", 200);
      },
    }
  );
});
