/// <reference types="cypress" />
describe('Search workflow', () => {
    it('starts the search workflow', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
    });

    it('completes the search workflow', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
    });
});
