import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que estou na página inicial do gov.br", () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    if (err.message.includes('$ is not defined') || 
        err.message.includes('jQuery') ||
        err.message.includes('ReferenceError')) {
      console.log('Erro ignorado:', err.message);
      return false;
    }
    return true;
  });
  
  cy.visit('https://www.gov.br/');
  cy.get('body').should('be.visible');
  cy.wait(1000);
});

Given("ignoro erros de jQuery não definido", () => {
});

Given("que fechei qualquer overlay que esteja cobrindo o campo de busca", () => {
  cy.get('body').then(($body) => {
    const overlay = $body.find('.overlay-wrapper, [aria-label*="Fechar"], .close-button');
    if (overlay.length) {
      cy.wrap(overlay).first().click({ force: true });
      cy.wait(500);
    }
  });
});

Given("que procuro pelo link {string} ou {string} no menu", (texto1, texto2) => {
  cy.log(`Procurando por link ${texto1} ou ${texto2}`);
});

Given("que estou na página de serviços do gov.br", () => {
  cy.visit('https://www.gov.br/pt-br/servicos');
  cy.wait(2000);
});

Given("que fechei qualquer overlay", () => {
  cy.get('body').then(($body) => {
    const closeBtn = $body.find('[aria-label*="Fechar"], .overlay-wrapper');
    if (closeBtn.length) {
      cy.wrap(closeBtn).first().click({ force: true });
    }
  });
});

Given("que limpei o campo de busca", () => {
  cy.get('input[type="search"]').first().clear({ force: true });
});


When("eu digito {string} no campo de busca", (texto) => {
  cy.get('input[type="search"], input[placeholder*="procura"]')
    .first()
    .clear({ force: true })
    .type(texto, { force: true });
});

When("pressiono Enter para buscar", () => {
  cy.get('input[type="search"]').first().type('{enter}');
  cy.wait(3000);
});

When("o link estiver visível", () => {
  cy.log('Verificando se link está visível');
});

When("eu clicar nele", () => {
  cy.get('body').then(($body) => {
    const agriculturaLink = $body.find('a:contains("Agricultura"), a:contains("Pecuária")');
    if (agriculturaLink.length && agriculturaLink.is(':visible')) {
      cy.wrap(agriculturaLink).first().click({ force: true });
    }
  });
});

When("eu buscar por {string}", (termo) => {
  cy.get('body').then(($body) => {
    const closeBtn = $body.find('[aria-label*="Fechar"], .overlay-wrapper');
    if (closeBtn.length) {
      cy.wrap(closeBtn).first().click({ force: true });
    }
  });
  
  cy.get('input[type="search"]').first()
    .clear({ force: true })
    .type(`${termo}{enter}`, { force: true });
  
  cy.wait(3000);
});

When("eu tentar voltar para a página inicial", () => {
  cy.get('body').then(($body) => {
    const logo = $body.find('[href="/"], [href="/pt-br"], .logo, img[alt*="gov.br"]');
    
    if (logo.length) {
      cy.wrap(logo).first().click({ force: true });
    } else {
      const homeLink = $body.find('a:contains("Página inicial"), a:contains("Início"), a:contains("Home")');
      if (homeLink.length) {
        cy.wrap(homeLink).first().click({ force: true });
      } else {
        cy.visit('https://www.gov.br/');
      }
    }
  });
  cy.wait(2000);
});

When("eu pressionar Enter sem digitar nada", () => {
  cy.get('input[type="search"]').first()
    .clear({ force: true })
    .type('{enter}', { force: true });
  cy.wait(2000);
});

Then("a página deve carregar completamente", () => {
  cy.get('body').should('be.visible');
});

Then("o corpo da página deve estar visível", () => {
  cy.get('body').should('be.visible');
});

Then("o título da página deve incluir {string}", (titulo) => {
  cy.title().should('include', titulo);
});

Then("o campo de busca deve estar visível", () => {
  cy.get('input[type="search"], input[placeholder*="procura"], input[name="SearchText"]')
    .should('be.visible');
});

Then("deve aceitar entrada de texto", () => {
  cy.get('input[type="search"]').first()
    .should('be.enabled')
    .and('not.be.disabled');
});

Then("devo ver resultados relacionados a agricultura", () => {
  cy.get('body').then(($body) => {
    const text = $body.text().toLowerCase();
    
    if (text.includes('agricultura') || text.includes('agro')) {
      expect(true).to.be.true;
    } else if ($body.find('.resultado, .search-results, .result-item').length > 0) {
      cy.get('.resultado, .search-results, .result-item')
        .first()
        .should(($el) => {
          expect($el.text().toLowerCase()).to.include('agricultura');
        });
    } else if (text.includes('busca') || text.includes('search') || text.includes('resultado')) {
      cy.get('body').should('contain.text', /agricultura/i);
    } else {
      cy.url().should(($url) => {
        expect($url.toLowerCase()).to.include('agricultura');
      });
    }
  });
});

Then("devo ser redirecionado para uma página sobre agricultura", () => {
  cy.url().should(($url) => {
    expect($url.toLowerCase()).to.include('agricultura');
  });
});

Then("a página deve conter texto sobre agricultura", () => {
  cy.get('body').should('contain.text', /agricultura/i);
});

Then("devo ser redirecionado para uma página relacionada a agricultura", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isValid = url.includes('agricultura') || 
                    url.includes('agro') || 
                    url.includes('pecuaria') ||
                    url.includes('mapa');
    expect(isValid, `URL deve conter agricultura/agro/pecuaria. URL atual: ${url}`).to.be.true;
  });
});

Then("a URL deve conter {string}, {string} ou {string}", (termo1, termo2, termo3) => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isValid = url.includes(termo1.toLowerCase()) || 
                    url.includes(termo2.toLowerCase()) || 
                    url.includes(termo3.toLowerCase());
    expect(isValid).to.be.true;
  });
});

Then("o conteúdo da página deve falar sobre agricultura ou pecuária", () => {
  cy.get('body').should(($body) => {
    const text = $body.text().toLowerCase();
    const hasContent = text.includes('agricultura') || 
                       text.includes('pecuária') || 
                       text.includes('agro') ||
                       text.includes('mapa');
    expect(hasContent, 'Deveria conter texto sobre agricultura/pecuária').to.be.true;
  });
});

Then("devo encontrar informações sobre o programa Bolsa Família", () => {
  cy.get('body').should(($body) => {
    const text = $body.text().toLowerCase();
    const found = text.includes('bolsa família') || 
                  text.includes('bolsa') || 
                  text.includes('família') ||
                  text.includes('auxílio');
    expect(found, 'Deveria encontrar informações sobre Bolsa Família').to.be.true;
  });
});

Then("devo ver texto sobre bolsa ou auxílio", () => {
  cy.get('body').should('contain.text', /bolsa|auxílio/i);
});

Then("devo ver uma mensagem indicando que não foram encontrados resultados", () => {
  cy.get('body').then(($body) => {
    const text = $body.text().toLowerCase();
    const possibleMessages = [
      'nenhum resultado',
      'não encontrado',
      '0 resultado',
      'sem resultados',
      'no results',
      'nenhum documento encontrado'
    ];
    
    let foundMessage = false;
    possibleMessages.forEach(message => {
      if (text.includes(message)) {
        foundMessage = true;
      }
    });
    
    expect(foundMessage, 'Deveria mostrar mensagem de "nenhum resultado"').to.be.true;
  });
});

Then("devo ver {string}", (mensagem) => {
  cy.get('body').should('contain.text', mensagem);
});

Then("devo ver poucos resultados na página", () => {
  cy.get('body').then(($body) => {
    const results = $body.find('.resultado, .search-result, .result-item, .item-resultado');
    expect(results.length, 'Deveria ter poucos resultados').to.be.lte(3);
  });
});

Then("devo estar na página inicial", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isHome = url === 'https://www.gov.br/' || 
                   url === 'https://www.gov.br' ||
                   url === 'https://www.gov.br/pt-br' ||
                   url === 'https://www.gov.br/pt-br/';
    expect(isHome, 'Deveria estar na página inicial').to.be.true;
  });
});

Then("o campo de busca deve estar visível", () => {
  cy.get('input[type="search"]').should('be.visible');
});

Then("devo permanecer na página inicial", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isHome = url === 'https://www.gov.br/' || 
                   url === 'https://www.gov.br' ||
                   url === 'https://www.gov.br/pt-br' ||
                   url === 'https://www.gov.br/pt-br/';
    expect(isHome, 'Deveria permanecer na página inicial').to.be.true;
  });
});

Then("devo permanecer em uma página similar do gov.br", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isValid = url.includes('www.gov.br') && 
                   (url.includes('/pt-br') || url === 'https://www.gov.br/');
    expect(isValid, 'Deveria permanecer em página do gov.br').to.be.true;
  });
});

Then("Ou devo ser redirecionado para uma página sobre agricultura", () => {

  cy.url().should(($url) => {
    expect($url.toLowerCase()).to.include('agricultura');
  });
});

Then("Ou devo ver texto sobre agricultura", () => {
  cy.get('body').should('contain.text', /agricultura/i);
});

Then("Ou devo ver {string}", (mensagem) => {
  cy.get('body').should('contain.text', mensagem);
});

Then("Ou devo ver poucos resultados na página", () => {
  cy.get('body').then(($body) => {
    const results = $body.find('.resultado, .search-result, .result-item, .item-resultado');
    expect(results.length).to.be.lte(3);
  });
});

Then("Ou devo permanecer na página inicial", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isHome = url === 'https://www.gov.br/' || 
                   url === 'https://www.gov.br' ||
                   url === 'https://www.gov.br/pt-br' ||
                   url === 'https://www.gov.br/pt-br/';
    expect(isHome).to.be.true;
  });
});

Then("Ou devo permanecer em uma página similar do gov.br", () => {
  cy.url().should(($url) => {
    const url = $url.toLowerCase();
    const isValid = url.includes('www.gov.br') && 
                   (url.includes('/pt-br') || url === 'https://www.gov.br/');
    expect(isValid).to.be.true;
  });
});

When("Usando o logo do site", () => {
  cy.get('[href="/"], [href="/pt-br"], .logo').first().click({ force: true });
});

When("Ou usando o link {string}", (linkText) => {
  cy.contains('a', linkText, { matchCase: false }).first().click({ force: true });
});

When("Ou acessando a URL diretamente", () => {
  cy.visit('https://www.gov.br/');
});

When("Senão", () => {
  cy.log('Executando fluxo alternativo');
});

When("eu buscar por {string}", (termo) => {
  cy.get('input[type="search"]').first()
    .clear({ force: true })
    .type(`${termo}{enter}`, { force: true });
  cy.wait(3000);
});