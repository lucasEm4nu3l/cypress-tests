// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('searchFor', (term) => {
  cy.get('input[type="search"]').first().clear().type(term + '{enter}');
});

Cypress.Commands.add('clickLinkByText', (text) => {
  cy.contains('a', text).first().click({ force: true });
});