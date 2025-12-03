// cypress/support/e2e.js

// Importa comandos customizados se existirem
import './commands';

// Adiciona comandos úteis para o gov.br
Cypress.Commands.add('buscarNoGov', (termo) => {
  cy.get('input[type="search"], input[name="q"], input[placeholder*="busca"], input[placeholder*="pesquisa"]')
    .first()
    .clear()
    .type(termo);
    
  cy.get('button[type="submit"], .search-button, button:contains("Pesquisar"), button:contains("Buscar")')
    .first()
    .click({ force: true });
});