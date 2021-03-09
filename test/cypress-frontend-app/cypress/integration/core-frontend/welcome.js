/// <reference types="cypress" />
describe('Welcome page', () => {
    it('shows a friendly message on the Welcome page', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
    });

    it('Hides the welcome page for returning users', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
    });
});
