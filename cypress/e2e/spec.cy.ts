export {};

describe("Auth", () => {
  beforeEach(() => {
    cy.login(Cypress.env("auth0_username"), Cypress.env("auth0_password"));
    cy.visit("/");
  });

  it("should have content for authenticated user", () => {});
});
