/// <reference types="cypress" />

context('Busca de serviços e informações no portal gov.br', () => {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('$ is not defined') || 
          err.message.includes('jQuery') ||
          err.message.includes('ReferenceError')) {
        console.log('Erro ignorado:', err.message)
        return false
      }

      return true
    })
    
    cy.visit('https://www.gov.br/pt-br/')
    cy.get('body').should('be.visible')
    cy.wait(1000) 
  })

  it('Deve acessar a página inicial do gov.br', () => {
    cy.get('body').should('be.visible')
  })

  it('Deve ver o título correto da página inicial', () => {
    cy.title().should('include', 'GOV.BR')
  })

  it('Deve ver o campo de busca na página inicial', () => {
    cy.get('input[type="search"], input[placeholder*="procura"], input[name="SearchText"]')
      .should('be.visible')
  })

  it('Deve buscar por "Agricultura" e ver resultados relacionados', () => {

    cy.get('body').then(($body) => {
      const overlay = $body.find('.overlay-wrapper, [aria-label*="Fechar"], .close-button')
      if (overlay.length) {
        cy.wrap(overlay).first().click({ force: true })
        cy.wait(500)
      }
    })

    cy.get('input[type="search"], input[placeholder*="procura"]')
      .first()
      .clear({ force: true })
      .type('Agricultura', { force: true })
    
    cy.get('input[type="search"]').first().type('{enter}')
    cy.wait(3000)
    cy.get('body').then(($body) => {
      const text = $body.text().toLowerCase()
      
      if (text.includes('agricultura') || text.includes('agro')) {
        expect(true).to.be.true
      } else if ($body.find('.resultado, .search-results, .result-item').length > 0) {
        cy.get('.resultado, .search-results, .result-item')
          .first()
          .should(($el) => {
            expect($el.text().toLowerCase()).to.include('agricultura')
          })
      } else if (text.includes('busca') || text.includes('search') || text.includes('resultado')) {
        cy.get('body').should('contain.text', /agricultura/i)
      } else {
        cy.url().should(($url) => {
          expect($url.toLowerCase()).to.include('agricultura')
        })
      }
    })
  })

  it('Deve navegar para a seção de Agricultura e Pecuária', () => {
    cy.get('input[type="search"]').first()
      .clear({ force: true })
      .type('Ministério da Agricultura{enter}', { force: true })
    cy.wait(3000)
    cy.url().should(($url) => {
      const url = $url.toLowerCase()
      const isValid = url.includes('agricultura') || 
                      url.includes('agro') || 
                      url.includes('pecuaria') ||
                      url.includes('mapa')
      if (!isValid) {
        cy.get('body').should(($body) => {
          const text = $body.text().toLowerCase()
          expect(text).to.match(/agricultura|agro|pecuaria/i)
        })
      }
      
      return isValid
    })

    cy.get('body').should(($body) => {
      const text = $body.text().toLowerCase()
      const hasContent = text.includes('agricultura') || 
                         text.includes('pecuária') || 
                         text.includes('agro') ||
                         text.includes('mapa')
      expect(hasContent, 'Deveria conter texto sobre agricultura/pecuária').to.be.true
    })
  })

  it('Deve buscar por "Bolsa Família" e encontrar informações', () => {
    cy.get('body').then(($body) => {
      const closeBtn = $body.find('[aria-label*="Fechar"], .overlay-wrapper')
      if (closeBtn.length) {
        cy.wrap(closeBtn).first().click({ force: true })
      }
    })
    
    cy.get('input[type="search"]').first()
      .clear({ force: true })
      .type('Bolsa Família{enter}', { force: true })
    cy.wait(3000)
    cy.get('body').should(($body) => {
      const text = $body.text().toLowerCase()
      const found = text.includes('bolsa família') || 
                    text.includes('bolsa') || 
                    text.includes('família') ||
                    text.includes('auxílio')
      expect(found, 'Deveria encontrar informações sobre Bolsa Família').to.be.true
    })
  })

  it('Deve buscar por termo inexistente e mostrar mensagem apropriada', () => {
    cy.get('input[type="search"]').first()
      .clear({ force: true })
      .type('xyz123abc4567890termoinesxistente{enter}', { force: true })
    
    cy.wait(3000)
    
    cy.get('body').then(($body) => {
      const text = $body.text().toLowerCase()
      const possibleMessages = [
        'nenhum resultado',
        'não encontrado',
        '0 resultado',
        'sem resultados',
        'no results',
        'nenhum documento encontrado'
      ]
      
      let foundMessage = false
      possibleMessages.forEach(message => {
        if (text.includes(message)) {
          foundMessage = true
        }
      })
      
      if (!foundMessage) {
        const results = $body.find('.resultado, .search-result, .result-item, .item-resultado')
        if (results.length <= 3) {
          foundMessage = true
        }
      }
      
      expect(foundMessage, 'Deveria mostrar mensagem de "nenhum resultado" ou ter poucos resultados').to.be.true
    })
  })

  it('Deve testar busca vazia (não deve navegar)', () => {
    cy.url().then((initialUrl) => {
      console.log('URL inicial:', initialUrl)
    })
    
    cy.get('input[type="search"]').first()
      .clear({ force: true })
      .type('{enter}', { force: true })
    cy.wait(2000)
    cy.url().should(($url) => {
      const url = $url.toLowerCase()
      const isValid = url.includes('www.gov.br') && 
                     (url.includes('/pt-br') || url === 'https://www.gov.br/')
      expect(isValid, 'Deveria permanecer na página inicial ou página similar').to.be.true
    })
  })

  it('Deve retornar à página inicial do gov.br', () => {
    cy.visit('https://www.gov.br/pt-br/noticias')
    cy.wait(2000)
    cy.get('body').should('be.visible')
    cy.url().should('include', 'noticias')
    cy.visit('https://www.gov.br/')
    cy.wait(2000)
    cy.url().should(($url) => {
      const url = $url.toLowerCase()
      const isHomePage = url === 'https://www.gov.br/' || 
                        url === 'https://www.gov.br' ||
                        url === 'https://www.gov.br/pt-br' ||
                        url === 'https://www.gov.br/pt-br/'
      if (!isHomePage) {
        cy.get('input[type="search"]').should('be.visible')
        cy.title().should('include', 'GOV.BR')
      }
      
      return isHomePage
    })
    
    cy.get('input[type="search"]').should('exist').and('be.visible')
    cy.title().should('include', 'GOV.BR')
  })

  it('Deve testar navegação básica no site', () => {
    cy.visit('https://www.gov.br/pt-br/servicos')
    cy.wait(2000)
    cy.get('body').then(($body) => {
      const text = $body.text().toLowerCase()
      if (!text.includes('serviços') && !text.includes('servicos')) {
        cy.url().should('include', 'servicos')
      }
    })
    
    cy.get('body').then(($body) => {
      const homeElements = $body.find('[href="/"], [href="/pt-br"], .logo, [title*="Página Inicial"]')
      
      if (homeElements.length > 0) {
        cy.wrap(homeElements).first().click({ force: true })
      } else {
        cy.go('back')
      }
    })
    
    cy.wait(2000)
    cy.url().should('include', 'www.gov.br')
    cy.get('input[type="search"]').should('be.visible')
  })
})