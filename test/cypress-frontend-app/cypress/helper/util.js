function germanBaseUrl() {
    return 'https://' + Cypress.env('germanHost');
}

function englishBaseUrl() {
    return 'https://' + Cypress.env('englishHost');
}

function frenchBaseUrl() {
    return 'https://' + Cypress.env('frenchHost');
}

module.exports = {
    germanBaseUrl,
    englishBaseUrl,
    frenchBaseUrl,
};
