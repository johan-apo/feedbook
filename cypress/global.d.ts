declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): any;
    getBySel(
      dataTestAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;
    getBySelLike(
      dataTestPrefixAttribute: string,
      args?: any
    ): Chainable<JQuery<HTMLElement>>;
  }
}
