export {};

describe("Auth", () => {
  beforeEach(() => {});

  it.only("should let a visitor to log out", () => {
    cy.login(Cypress.env("auth0_email"), Cypress.env("auth0_password"));
    cy.visit("/");
    cy.getBySel("profile-button").click();
    cy.getBySel("log_out").click();
    cy.getBySel("signup_login_buttons").should("exist");
  });

  it("should redirect the user when not authenticated", () => {});
});
