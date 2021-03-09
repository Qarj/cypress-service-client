/// <reference types="cypress" />
describe('Canary', () => {
    it('checks the canary page', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
    });
});
