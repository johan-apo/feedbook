export {};

describe("Auth", () => {
  beforeEach(() => {});

  it.skip("should let a user to log out", () => {
    cy.login(Cypress.env("auth0_email"), Cypress.env("auth0_password"));
    cy.visit("/");
    cy.getBySel("profile-button").click();
    cy.getBySel("log_out").click();
    cy.getBySel("signup_login_buttons").should("exist");
  });

  it.skip("should redirect when user is not authenticated and tries edit profile", () => {
    cy.visit("/");
    cy.origin("https://auth0.com", () => {
      cy.visit(`http://localhost:3000/${Cypress.env("auth0_username")}/edit`);
      cy.url().should("include", Cypress.env("auth0_domain"));
    });
  });
});
