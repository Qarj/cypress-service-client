/// <reference types="cypress" />
const util = require('../../helper/util');
describe('Frontend Canary', () => {
    it('checks the frontend canary page', () => {
        cy.log(`Running on brand ${Cypress.env('brandHost')}`);
        expect(true).to.equal(true);
        cy.log(`German url is ${util.germanBaseUrl()}`);
        cy.customCommand();
        cy.fixture('myFixture.json').as('special');
        cy.get('@special').then((special) => {
            cy.log(special.body);
        });
    });
});
