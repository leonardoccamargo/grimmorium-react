# Grimmorium React (2° MVP)

Aplicação SPA para gerenciamento de personagens e consulta de magias de RPG, com navegação entre páginas, componentização e simulação de requisições a servidor via leitura de arquivos JSON.

## Funcionalidades principais

- Navegação entre páginas: Home, Personagens, Grimório, Jogar e rota 404.
- Cadastro, edição e remoção de personagens.
- Busca e listagem em cards.
- Consulta de magias com filtro por nível, paginação e painel de detalhes.
- Alternância de idioma (PT-BR/EN) e tema (claro/escuro).
- Feedback visual de carregamento, sucesso, aviso e erro.

## Tecnologias

- React
- React Router DOM
- Vite
- CSS

## Instalação e execução local

### Pré-requisitos

- Node.js 18+
- npm 9+

### Passo a passo

```bash
npm install
npm run dev
```

Aplicação disponível em: http://localhost:5173

## Como utilizar

1. Abra a página inicial para acessar a visão geral do sistema.
2. Acesse Personagens para buscar, cadastrar, editar e remover fichas.
3. Entre em Grimório para filtrar magias por nível e visualizar detalhes.
4. Abra a rota Jogar para atualizar valores da ficha durante a sessão.
5. Use os botões do cabeçalho para alternar idioma e tema.

### Outros comandos

```bash
npm run build
npm run preview
npm run lint
```

### Modo de dados para avaliação do MVP

Por padrão, a seção de personagens roda em modo `mock` usando JSON local (conforme a diretriz da avaliação).

- Padrão (não precisa configurar nada):
	- usa `public/personagens.json`
- Opcional para evolução com backend:
	- crie um arquivo `.env` na raiz e defina:

```bash
VITE_CHARACTERS_DATA_MODE=api
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Estrutura de pastas

```text
grimmorium-react/
	public/
		personagens.json
		magias.json
	src/
		components/
		context/
		pages/
		App.jsx
		main.jsx
```

## Rotas da aplicação

- / -> Home
- /personagens -> Lista, busca e gestão de personagens
- /grimorio -> Lista e detalhes de magias
- /jogar/:id -> Ficha do personagem (visualização/edição)
- * -> 404 Not Found

## Observação sobre dados simulados

Conforme a regra do MVP, os dados principais são carregados por leitura de JSON local para simular chamadas ao servidor.

## Aderência aos critérios do MVP (2° trimestre)

### Componentização

- Aplicação com 5 páginas: Home, Personagens, Grimório, Jogar e 404.
- Componentes reutilizados em múltiplas telas e fluxos:
	- Header
	- PageTitle
	- LoadingIndicator
	- ConfirmModal
	- SearchBar
	- CharacterCard
	- SpellCard
	- Tooltip
- Diferenciais visuais e funcionais:
	- Tema claro/escuro
	- Alternância de idioma PT-BR/EN
	- Fluxo de jogo com edição de ficha em tempo real
	- Painel de grimório com filtro, paginação e detalhe

### React, hooks e roteamento

- Hooks de estado/efeito em uso: useState, useEffect, useMemo.
- Navegação com React Router.
- Hooks de navegação exigidos:
	- useNavigate
	- useParams
	- useLocation
- Rota de erro implementada para URLs inexistentes (404).

### Usabilidade

- Feedback visual de carregamento, sucesso, aviso e erro.
- Tooltips explicativas em ações principais.
- Mensagens condicionais de contexto (ex.: nenhum item encontrado).
- Layout responsivo para desktop, tablet e celular com media queries e grid/flex adaptativos.

### Organização e boas práticas

- Estrutura de pastas por responsabilidade: components, context, pages, utils.
- Convenções de nomenclatura consistentes para componentes e arquivos.
- README com instruções completas de instalação e execução.

## Checklist de entrega final

- Publicar repositório no GitHub e confirmar link correto.
- Gravar vídeo com no máximo 5 minutos.
- Mostrar no vídeo:
	- objetivo da aplicação
	- 4 componentes reutilizados
	- navegação com hooks e rota 404
	- elementos de usabilidade e responsividade
