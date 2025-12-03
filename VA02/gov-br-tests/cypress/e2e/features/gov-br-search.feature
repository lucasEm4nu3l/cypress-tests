# language: pt

Funcionalidade: Busca de serviços e informações no portal gov.br

Regras de negócio:
- O site deve carregar corretamente
- A busca deve retornar resultados relevantes
- A navegação entre seções deve funcionar
- O usuário deve conseguir retornar à página inicial

Configuração:
Dado que estou na página inicial do gov.br
E ignoro erros de jQuery não definido

Cenário: Acessar a página inicial do gov.br
Então a página deve carregar completamente
E o corpo da página deve estar visível

Cenário: Verificar título da página inicial
Então o título da página deve incluir "GOV.BR"

Cenário: Verificar campo de busca na página inicial
Então o campo de busca deve estar visível
E deve aceitar entrada de texto

Cenário: Buscar por "Agricultura" e ver resultados relacionados
Dado que fechei qualquer overlay que esteja cobrindo o campo de busca
Quando eu digito "Agricultura" no campo de busca
E pressiono Enter para buscar
Então devo ver resultados relacionados a agricultura
Ou devo ser redirecionado para uma página sobre agricultura
Ou a página deve conter texto sobre agricultura

Cenário: Navegar para a seção de Agricultura e Pecuária
Dado que procuro pelo link "Agricultura" ou "Pecuária" no menu
Quando o link estiver visível
E eu clicar nele
Senão
Quando eu buscar por "Ministério da Agricultura e Pecuária"
Então devo ser redirecionado para uma página relacionada a agricultura
E a URL deve conter "agricultura", "agro" ou "pecuaria"
E o conteúdo da página deve falar sobre agricultura ou pecuária

Cenário: Buscar por "Bolsa Família" na assistência social
Dado que fechei qualquer overlay
Quando eu buscar por "Bolsa Família"
Então devo encontrar informações sobre o programa Bolsa Família
Ou devo ver texto sobre bolsa ou auxílio

Cenário: Buscar por termo inexistente (teste inválido)
Quando eu buscar por "xyz123abc4567890termoinesxistente"
Então devo ver uma mensagem indicando que não foram encontrados resultados
Ou devo ver "nenhum resultado"
Ou devo ver "0 resultado"
Ou devo ver "sem resultados"
Ou devo ver "não encontrado"
Ou devo ver poucos resultados na página

Cenário: Retornar à página inicial do gov.br
Dado que estou na página de serviços do gov.br
Quando eu tentar voltar para a página inicial
Usando o logo do site
Ou usando o link "Página inicial"
Ou acessando a URL diretamente
Então devo estar na página inicial
E o campo de busca deve estar visível

Cenário: Testar busca vazia (teste de validação)
Dado que limpei o campo de busca
Quando eu pressionar Enter sem digitar nada
Então devo permanecer na página inicial
Ou devo permanecer em uma página similar do gov.br